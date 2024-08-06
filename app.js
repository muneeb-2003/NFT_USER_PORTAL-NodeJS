const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user')

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/read', async (req, res) => {
    let users = await userModel.find()
    res.render("read", { users });
});
app.get('/edit/:id', async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.params.id });
        if (user) {
            res.render("edit", { user });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});
// app.post('/edit/:id', async (req, res) => {
//     let { name, email, image } = req.body;
//     let user = await userModel.findOneAndUpdate({ _id: req.params.userid }, { image, email, name }, { new: true })
//     res.redirect("/read")
// });
app.post('/update/:id', async (req, res) => {
    let { image, name, email } = req.body;
    try {
        let user = await userModel.findOneAndUpdate(
            { _id: req.params.id },
            { image, name, email },
            { new: true, runValidators: true }
        );

        if (user) {
            res.redirect("/read");
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// app.post('/update/:id', async (req, res) => {
//     let { image, name, email } = req.body;
//     try {
//         // Find and update the user
//         let user = await userModel.findOneAndUpdate(
//             { _id: req.params.id },
//             { image, name, email },
//             { new: true, runValidators: true } // Add runValidators to validate updated fields
//         );

//         if (user) {
//             res.redirect("/read?message=User updated successfully"); // Redirect with a success message
//         } else {
//             res.status(404).send('User not found');
//         }
//     } catch (error) {
//         console.error('Error updating user:', error); // Log the error for debugging
//         res.status(500).send('Internal Server Error');
//     }
// });


app.get('/delete/:id', async (req, res) => {
    let users = await userModel.findOneAndDelete({ _id: req.params.id })
    res.redirect("/read");
});

// app.get('/edit/:id', async (req, res) => {
//     console.log('Edit user ID:', req.params.id);
//     try {
//         let users = await userModel.findOne({ _id: req.params.id });
//         console.log('User found:', users);
//         res.render("edit", { users });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });



// app.post('/create', async (req, res) => {
//     let { name, email, image } = req.body;
//     let createdUser = await userModel.create({
//         name,
//         image,
//         email
//     });
//     res.send(createdUser)
// });
app.post('/create', async (req, res) => {
    console.log('Received request:', req.body);
    let { name, email, image } = req.body;
    try {
        let createdUser = await userModel.create({ name, image, email });
        res.redirect("/read");
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
