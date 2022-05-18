const express = require('express');
const client = require('./database');
const app = express();
//const insert = require('./innsertdata');
const PORT = process.env.PORT || 4000;
app.set("view engine", "ejs");
const session = require('express-session');
app.use(express.static("public"));
app.use(express.static("concept-master"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let alert = require("alert");

app.use(session({
    secret: 'SecretStringForSession',
    cookie: { maxAge: 60000 * 60 },
    resave: true,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/register", (req, res) => {
    res.render("register");

});


app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/admin", (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        res.render("admin");
    } else {
        res.redirect('/')
    }
});

app.get("/user", (req, res) => {
    res.render("user");
})

app.get("/addq", (req, res) => {
    res.render("addq");
})
app.get("/dashbord", (req, res) => {
    res.render("dashbord", { user: "Xyz" });
});
// TURMS PAGE USER SIDE
app.get('/terms', (req, res) => {
    se = req.session;
    if (se.userid) {
        client.query(`Select * from rules`, (err, result) => {
            if (!err) {
                console.log(result.rows);
                let id = se.userid;
                res.render('terms', { terms: result.rows, id: id })
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/')
    }
    client.end;
})
// REGISTER
app.post("/register", (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let qua = req.body.qua;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    client.query("SELECT email from regdetails where email= $1 ", [email], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.rows.length > 0) {
                res.redirect('/register');
                alert(" user already exist.");
                console.log("alredy exist");
            } else {
                var sql = `INSERT INTO regdetails(name,qua,email,username,password)
                                VALUES ('${name}','${qua}','${email}','${username}','${password}')`;
                client.query(sql, function (err, result) {
                    if (err) throw err;
                    res.redirect('/login');
                    alert("Registration successful");
                    console.log('record inserted');
                });
            }
        }
    })


    client.end;

});
// USER SHOW HTML QUESTION
app.post('/htmlquestion', (req, res) => {
    se = req.session;
    se.subject = req.body.sub;
    console.log(req.body.sub);
    if (se.userid) {
        client.query('SELECT * from "qhtml" Limit 25', (err, result) => {
            if (!err) {
                // console.log(result.rows);
                res.render('htmlquestion', { question: result.rows })
            } else {
                console.log(err.stack);
            }
        })
    } else {
        res.redirect('/')
    }
})
// USER SHOW CSS QUESTION
app.post('/cssquestion', (req, res) => {
    se = req.session;
    se.subject = req.body.sub;
    if (se.userid) {
        client.query('SELECT * from "qcss" Limit 25', (err, result) => {
            if (!err) {
                // console.log(result.rows);
                res.render('cssquestion', { question1: result.rows })
            } else {
                console.log(err.stack);
            }
        })
    } else {
        res.redirect('/')
    }
})
// USER SHOW JS QUESTION
app.post('/jsquestion', (req, res) => {
    se = req.session;
    se.subject = req.body.sub;
    if (se.userid) {

        client.query('SELECT * from "javascript" Limit 25', (err, result) => {
            if (!err) {
                console.log(result.rows);
                res.render('javascriptquestion', { question2: result.rows })
            } else {
                console.log(err.stack);
            }
        })
    } else {
        res.redirect('/')
    }
})
//DELETE TERMS
app.get('/delterm/:id', function (req, res, next) {
    client.query(`delete from rules where id=$1`, [req.params.id], (err, result) => {
        if (!err) {
            res.redirect('/term_cond');
            alert("terms deleted successfully!");
            console.log(result.rows);

        } else {
            console.log(err.stack);
        }
    });
    client.end;

});


// delete CSS Question

app.get('/deleditforCSS/:id', function (req, res, next) {
    client.query(`delete from qcss where id=$1`, [req.params.id], (err, result) => {
        if (!err) {
            // res.send(result.rows);
            res.redirect('/editforCSS');
            alert("question deleted successfully!");
            console.log(result.rows);

        } else {
            console.log(err.stack);
        }
    });
    client.end;

});

// delete HTML Question

app.get('/deleditforHTML/:id', function (req, res, next) {
    console.log(req.params.id);
    client.query('DELETE from qhtml where id= $1', [req.params.id], (err, result) => {
        if (!err) {
            res.redirect('/editforHTML');
            alert("question deleted successfully!");
            console.log(result.rows);

        } else {
            console.log(err.stack);
        }
    });
    client.end;

});

//delete user

app.get('/delusershow/:email', function (req, res, next) {
    client.query(`delete from regdetails where email=$1`, [req.params.email], (err, result) => {
        if (!err) {
            // res.send(result.rows);
            res.redirect('/usershow');
            alert("user deleted duccessfully!.");
            console.log(result.rows);

        } else {
            console.log(err.stack);
        }
    });
    client.end;

});
//DELETE javascript

app.get('/deleditforJS/:id', function (req, res, next) {
    client.query(`delete from javascript where id=$1`, [req.params.id], (err, result) => {
        if (!err) {
            res.redirect('/editforJS');
            alert("question deleted successfully!");
            console.log(result.rows);

        } else {
            console.log(err.stack);
        }
    });
    client.end;

});

//login
app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // Ensure the input fields exists and are not empty
    console.log(req.body);
    client.query("SELECT email,password,id,name FROM regdetails WHERE email = $1 AND password = $2", [email, password], function (error, results) {
        if (error) throw error;
        if (results.rowCount > 0) {
            console.log(results.rows[0]);
            if ((results.rows[0].email == email) && (results.rows[0].password == password)) {
                let se = req.session;
                se.userid = results.rows[0].id;
                se.name = results.rows[0].name;
                se.email = results.rows[0].email;
                console.log(se.userid);
                if (results.rows[0].email == 'admin@gmail.com' || results.rows[0].email == 'admin1@gmail.com') {
                    console.log("you are logged in");
                    se.admin = results.rows[0].email;
                    console.log(se.admin);
                    res.redirect('/admin');
                    alert("Admin successfully logged in");
                } else {
                    res.redirect('/first');
                    alert("User successfully logged in");

                }
            }
        } else {
            alert("Incorrect Username and/or Password!");
            res.redirect('/login');
            console.log("Incorrect Username and/or Password!");
        }
        res.end();

    });

});

//first page open after login
app.get('/first', function (req, res) {
    se = req.session;
    if (se.userid) {
        client.query('SELECT * FROM "result" WHERE sid = $1', [se.userid], (err, result) => {
            if (!err) {
                // if (result.rows.length > 0) {
                console.log("you are logged in");
                // console.log(result.rows[0].subb_date);

                // res.redirect('/first');
                res.render('first', { examresult: result.rows[0] });
                // alert("User successfully logged in");
                // } else {
                //     res.render('first', { examresult: "" });
                // }
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/');
    }
});

//
app.get('/goto',(req,res)=>{
    res.redirect('/first');
})

// Add Terms Admin
app.post('/term_cond', function (req, res, next) {
    let user = req.body.terms;
    client.query("SELECT terms from rules where terms= $1 ", [user], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.rows.length > 0) {
                res.redirect('/term_cond');
                alert("terms already exist");

                console.log("alredy exist");
            } else {
                let insertQuery = `INSERT INTO rules(terms) 
                values('${user}')`;
                client.query(insertQuery, (err, result) => {
                    if (!err) {
                        res.redirect('/term_cond');
                        alert("terms added successfully");
                        console.log('terms was successful');
                    } else { console.log(err.message); }
                });
            }
        }
    })

});




// Add html Admin

app.post('/abc', function (req, res, next) {

    // store all the user input data
    let user = req.body;
    client.query("SELECT question from qhtml where question= $1 ", [user.qu], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.rows.length > 0) {
                res.redirect("/editforHTML");
                alert("Question already exist");

                console.log("Question alredy exist");

            } else {
                let insertQuery = `insert into qhtml(question,op1,op2,op3,op4,ans) 
                values('${user.qu}', '${user.op1}', '${user.op2}', '${user.op3}', '${user.op4}', '${user.ans}')`;

                client.query(insertQuery, (err, result) => {
                    if (!err) {
                        res.redirect('/editforHTML');
                        alert("Question successfuly added");

                        console.log('Question Added');

                    } else {
                        console.log(err.message);
                    }
                })
            }
        }
    })
    client.end;
});

// ADD css

app.post('/css', function (req, res, next) {

    let user = req.body;
    client.query("SELECT question from qcss where question= $1 ", [user.qucss], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.rows.length > 0) {
                res.redirect("/editforCSS");
                alert("Question already exist");
                console.log("Question alredy exist");

            } else {
                let insertQuery = `insert into qcss(question,op1,op2,op3,op4,ans) 
                               values('${user.qucss}', '${user.op1css}', '${user.op2css}', '${user.op3css}', '${user.op4css}','${user.ans}')`;

                client.query(insertQuery, (err, result) => {

                    if (!err) {
                        res.redirect('/editforCSS');
                        alert("Question successfuly added");
                        console.log('Question Added');

                    } else console.log(err.message);
                })
            }
        }
    })
});

//  JavaSript Add Question
app.post('/editforJS', function (req, res, next) {
    let user = req.body;
    client.query("SELECT question from javascript where question= $1 ", [user.question], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.rows.length > 0) {
                res.redirect("/editforJS");
                alert("Question already exist");
                console.log("Question alredy exist");

            } else {
                let insertQuery = `insert into javascript(question, op1, op2, op3, op4,ans) 
                values('${user.question}', '${user.op1}', '${user.op2}', '${user.op3}', '${user.op4}','${user.ans}')`;

                client.query(insertQuery, (err, result) => {
                    if (!err) {
                        res.redirect('/editforJS');
                        alert("Question successfuly added");
                        console.log('Question Added');
                    } else console.log(err.message);
                })
            }
        }
    })


    client.end;

});
//ADD USER
app.post("/adduser", (req, res) => {
    // let id = req.body;
    let name = req.body.name;
    let qua = req.body.qua;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    client.query("SELECT email from regdetails where email= $1 ", [email], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.rows.length > 0) {
                res.redirect("/usershow");
                alert(" user already exist");
                console.log("alredy exist");

            } else {
                var sql = `INSERT INTO regdetails(name,qua,email,username,password)
                                VALUES ('${name}','${qua}','${email}','${username}','${password}')`;
                client.query(sql, function (err, result) {
                    if (err) throw err;
                    res.redirect("/usershow");
                    alert("user successfully inserted!");
                    console.log('record inserted');

                });
            }
        }
    })

    client.end;

});
//admin/user SHOW
app.get('/usershow', (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        client.query(`Select * from regdetails  ORDER BY id ASC`, (err, result) => {
            if (!err) {
                console.log(result.rows);
                res.render('usershow', { userdata: result.rows })
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/')
    }
    client.end;
})
// Show HTML 
app.get('/editforHTML', (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        client.query(`Select * from qhtml ORDER BY id ASC`, (err, result) => {
            if (!err) {
                // res.send(result.rows);
                console.log(result.rows);
                res.render('editforHTML', { htmldata: result.rows })
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/')
    }
    client.end;
})
// Show CSS
app.get('/editforCSS', (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        client.query(`Select * from qcss ORDER BY id ASC`, (err, result) => {
            if (!err) {
                // res.send(result.rows);
                console.log(result.rows);
                res.render('editforCSS', { cssdata: result.rows })
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/')
    }
    client.end;
});
// Show JS
app.get('/editforJS', function (req, res, next) {
    se = req.session;
    if (se.userid && se.admin) {
        client.query(`Select * from javascript ORDER BY id ASC`, (err, result) => {
            if (!err) {
                // res.send(result.rows);
                console.log(result.rows);
                res.render('editforJS', { JSData: result.rows })
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/')
    }
    client.end;

});
// Show TERMS
app.get('/term_cond', (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        client.query(`Select * from rules  ORDER BY id ASC`, (err, result) => {
            if (!err) {
                // res.send(result.rows);
                console.log(result.rows);
                res.render('term_cond', { terms: result.rows })
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/')
    }
    client.end;
});
//UPDATE RULE
app.post('/ruleUpdate/:id', function (req, res) {
    console.log(req.body.terms)
    console.log(req.params.id);
    client.query('UPDATE "rules" SET terms = $1 WHERE id =$2', [req.body.terms, req.params.id], (err, result) => {
        if (!err) {
            // console.log(result.rows);
            alert("record updated successfully");
            res.redirect('/term_cond');
        } else {
            console.log(err.stack);
        }
    })

});

// Update Question for CSS

app.post('/CSSUpdate/:id', function (req, res) {
    let d = req.body
    let flag = false;
    console.log(req.body)
    console.log(req.params.id);
    client.query('SELECT question FROM qcss WHERE id != $1', [req.params.id], (err, result) => {
        for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].question == d.question) {
                // console.log("exists");
                // res.redirect('/editforHTML');
                //         alert("record exists");
                flag = false;
                break;

            } else {
                flag = true;
                console.log('update');
            }
        }
        if (flag) {
            client.query('UPDATE "qcss" SET question = $1, op1=$2, op2=$3, op3=$4, op4=$5, ans=$7 WHERE id =$6', [d.question, d.op1, d.op2, d.op3, d.op4, req.params.id, d.ans], (err, result) => {
                if (!err) {
                    res.redirect('/editforCSS');
                    alert("record updated successfully");
                    console.log(result.rows);
                } else {
                    console.log(err.stack);
                }
            })
        } else {
            res.redirect('/editforCSS');
            alert("record exists ");
        }
    })

});

// Update HTML Question

app.post('/htmlUpdate/:id', function (req, res) {
    let d = req.body
    let flag = false;
    console.log(req.body)
    console.log(req.params.id);
    client.query('SELECT question FROM qhtml WHERE id != $1', [req.params.id], (err, result) => {
        for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].question == d.question) {
                // console.log("exists");
                // res.redirect('/editforHTML');
                //         alert("record exists");
                flag = false;
                break;

            } else {
                flag = true;
                console.log('update');
            }
        }
        if (flag) {

            client.query('UPDATE "qhtml" SET question = $1, op1=$2, op2=$3, op3=$4, op4=$5, ans=$6 WHERE id =$7', [d.question, d.op1, d.op2, d.op3, d.op4, d.ans, req.params.id], (err, result) => {
                if (!err) {
                    res.redirect('/editforHTML');
                    alert("record updated successfully");
                    // console.log(result.rows);

                } else {
                    console.log(err.stack);
                }
            })
        } else {
            res.redirect('/editforHTML');
            alert("record exists ");
        }
    })

});

// Update JS Question

app.post('/jsUpdate/:id', function (req, res) {
    let d = req.body
    let flag = false;
    console.log(req.body)
    console.log(req.params.id);
    client.query('SELECT question FROM javascript WHERE id != $1', [req.params.id], (err, result) => {
        for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].question == d.question) {
                // console.log("exists");
                // res.redirect('/editforHTML');
                //         alert("record exists");
                flag = false;
                break;

            } else {
                flag = true;
                console.log('update');
            }
        }
        if (flag) {
            client.query('UPDATE "javascript" SET question = $1, op1=$2, op2=$3, op3=$4, op4=$5 ,ans=$7 WHERE id =$6', [d.question, d.op1, d.op2, d.op3, d.op4, req.params.id, d.ans], (err, result) => {
                if (!err) {
                    res.redirect('/editforJS');
                    alert("record updated successfully");
                    console.log(result.rows);

                } else {
                    console.log(err.stack);
                }
            })
        } else {
            res.redirect('/editforJS');
            alert("record exists ");
        }
    })

});

// Update User Details

app.post('/userUpdate/:id', function (req, res) {
    let d = req.body
    console.log(req.body)
    console.log(req.params.id);
    client.query('SELECT email FROM regdetails WHERE id != $1', [req.params.id], (err, result) => {
        for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].email == d.email) {
                // console.log("exists");
                // res.redirect('/editforHTML');
                //         alert("record exists");
                flag = false;
                break;

            } else {
                flag = true;
                console.log('update');
            }
        }
        if (flag) {
            client.query('UPDATE "regdetails" SET name = $1, email=$2, username=$3, password=$4, qua=$5 WHERE id =$6', [d.name, d.email, d.username, d.password, d.qua, req.params.id], (err, result) => {
                if (!err) {
                    res.redirect('/usershow');
                    alert("record updated successfully");
                    console.log(result.rows);

                } else {
                    console.log(err.stack);
                }
            })
        } else {
            res.redirect('/usershow');
            alert("record exists ");
        }
    })

});

//admin HTML result
app.get('/adminresultHtml', (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        client.query('SELECT name,email,scorehtml,correctanshtml,incorrectanshtml,subb_date,subb_time FROM "result" ', (err, result) => {
            if (!err) {
                if (result.rows.length > 0) {
                    console.log(result.rows[0].scorehtml);
                    console.log(result.rows[1]);
                    res.render('adminresultHtml', { htmlresult: result.rows });
                } else {
                    res.render('adminresultHtml', { htmlresult: "" });
                }
            }
        })
    } else {
        res.redirect('/');
    }

});


//admin CSS Result
app.get('/adminresultCss', (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        client.query('SELECT name,email,scorecss,correctanscss,incorrectanscss,css_date,css_time FROM "result" WHERE scorecss IS NOT NULL', (err, result) => {
            if (!err) {
                if (result.rows.length > 0) {
                    // console.log(result.rows[0].scorecss);
                    // console.log(result.rows[1]);
                    res.render('adminresultCss', { cssresults: result.rows });
                } else {
                    res.render('adminresultCss', { cssresults: "" });
                }
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/');
    }
    // res.render('adminresultCss');
});

//admin JS Result
app.get('/adminresultJS', (req, res) => {
    se = req.session;
    if (se.userid && se.admin) {
        client.query('SELECT name,email,scorejs,correctansjs,incorrectansjs,js_date,js_time FROM "result" WHERE scorejs IS NOT NULL', (err, result) => {
            if (!err) {
                if (result.rows.length > 0) {
                    // console.log(result.rows[0].scorecss);
                    // console.log(result.rows[1]);
                    res.render('adminresultJS', { jsresult: result.rows });
                } else {
                    res.render('adminresultJS', { jsresult: "" });
                }
            } else {
                console.log(err.stack);
            }
        });
    } else {
        res.redirect('/');
    }
});





//admin logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log('logout');
    res.redirect('/');
})
// app.get('/tq1',(req,res)=>{
//     res.redirect('/thankyou');
// })



app.post("/thankyou", (req, res) => {
    // let ans = req.body;
    // console.log(ans.que45);
    var marks = 0,
        incorrect = 0;
    // console.log(se.subject)
    se = req.session;
    if (se.subject == "html") {
        user_answer = Object.values(req.body);
        client.query('SELECT * FROM "qhtml" Limit 25', (err, result) => {
            // result.rows;
            for (let i = 0; i < result.rows.length; i++) {
                console.log(result.rows[i].ans);
                console.log(user_answer[i]);
                if (result.rows[i].ans == user_answer[i]) {
                    marks++;
                } else if (user_answer[i] === undefined) {

                } else {
                    incorrect++;
                }
            }
            client.query('SELECT ("scorehtml") FROM "result" where sid = $1', [se.userid], (err, r) => {
                if (r.rows.length > 0) {
                    client.query('UPDATE "result" SET scorehtml=$1, correctanshtml=$2, incorrectanshtml=$3, subb_date=CURRENT_DATE, subb_time=CURRENT_TIME WHERE sid =$4', [marks, marks, incorrect, se.userid], (err, rhtml) => {
                        if (!err) {
                            console.log("html score update");
                            res.render("thankyou", { subject: se.subject, score: marks, correct: marks, incorrect: incorrect });
                        } else {
                            console.log(err.stack);
                        }
                    });
                } else {
                    client.query('INSERT INTO "result" ("name","email","scorehtml","correctanshtml","incorrectanshtml","sid","subb_date","subb_time") values ($1,$2,$3,$4,$5,$6,CURRENT_DATE,CURRENT_TIME)', [se.name, se.email, marks, marks, incorrect, se.userid], (err, rhtmlinsert) => {
                        if (!err) {
                            res.render("thankyou", { subject: se.subject, score: marks, correct: marks, incorrect: incorrect });
                            console.log("html score insert");
                        } else {
                            console.log(err.stack);
                        }
                    });
                }
            })
            if (se.userid)
                client.query('')
            console.log(marks);
            console.log(incorrect);
        })
    } else if (se.subject == "css") {
        user_answer = Object.values(req.body);
        client.query('SELECT * FROM "qcss" Limit 25', (err, result) => {
            // result.rows;
            for (let i = 0; i < result.rows.length; i++) {
                console.log(result.rows[i].ans);
                console.log(user_answer[i]);
                if (result.rows[i].ans == user_answer[i]) {
                    marks++;
                } else if (user_answer[i] === undefined) {

                } else {
                    incorrect++;
                }
            }
            client.query('SELECT ("scorecss") FROM "result" where sid = $1', [se.userid], (err, r) => {
                if (r.rows.length > 0) {
                    client.query('UPDATE "result" SET scorecss=$1, correctanscss=$2, incorrectanscss=$3, css_date=CURRENT_DATE, css_time=CURRENT_TIME WHERE sid =$4', [marks, marks, incorrect, se.userid], (err, rhtml) => {
                        if (!err) {
                            res.render("thankyou", { subject: se.subject, score: marks, correct: marks, incorrect: incorrect });
                            console.log("css score update");
                        } else {
                            console.log(err.stack);
                        }
                    });
                } else {
                    client.query('INSERT INTO "result" ("name","email","scorecss","correctanscss","incorrectanscss","sid","css_date","css_time") values ($1,$2,$3,$4,$5,$6,CURRENT_DATE,CURRENT_TIME)', [se.name, se.email, marks, marks, incorrect, se.userid], (err, rhtmlinsert) => {
                        if (!err) {
                            res.render("thankyou", { subject: se.subject, score: marks, correct: marks, incorrect: incorrect });
                            console.log("css score insert");
                        } else {
                            console.log(err.stack);
                        }
                    });
                }
            })
            if (se.userid)
                // client.query('')
                console.log(marks);
            console.log(incorrect);
        })
    } else {
        user_answer = Object.values(req.body);
        client.query('SELECT * FROM "javascript" Limit 25', (err, result) => {
            // result.rows;
            for (let i = 0; i < result.rows.length; i++) {
                console.log(result.rows[i].ans);
                console.log(user_answer[i]);
                if (result.rows[i].ans == user_answer[i]) {
                    marks++;
                } else if (user_answer[i] === undefined) {

                } else {
                    incorrect++;
                }
            }
            client.query('SELECT ("scorejs") FROM "result" where sid = $1', [se.userid], (err, r) => {
                if (r.rows.length > 0) {
                    client.query('UPDATE "result" SET scorejs=$1, correctansjs=$2, incorrectansjs=$3, js_date=CURRENT_DATE, js_time=CURRENT_TIME WHERE sid =$4', [marks, marks, incorrect, se.userid], (err, rhtml) => {
                        if (!err) {
                            res.render("thankyou", { subject: se.subject, score: marks, correct: marks, incorrect: incorrect });
                            console.log("JavaScript score update");
                        } else {
                            console.log(err.stack);
                        }
                    });
                } else {
                    client.query('INSERT INTO "result" ("name","email","scorejs","correctansjs","incorrectansjs","sid") values ($1,$2,$3,$4,$5,$6)', [se.name, se.email, marks, marks, incorrect, se.userid], (err, rhtmlinsert) => {
                        if (!err) {
                            res.render("thankyou", { subject: se.subject, score: marks, correct: marks, incorrect: incorrect });
                            console.log("JavaScript score insert");
                        } else {
                            console.log(err.stack);
                        }
                    });
                }
            })
            if (se.userid)
                // client.query('')
                console.log(marks);
            console.log(incorrect);
        })
    }

});

//admin result
app.get('/adminresult', (req, res) => {
    res.render('adminresult');
})

app.listen(PORT, () => {
    console.log('Serever is running on http://localhost:4000')
});