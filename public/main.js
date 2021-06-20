const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");


// Display NAV
const loginCheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));

    document.getElementById("new-post").style.display = "block";

  } else {

    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));


    document.getElementById("new-post").style.display = "none";
  }
};

// Register
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  // Authenticate the User
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signUpForm.reset();
      // close the modal
      $("#signupModal").modal("hide");
    });
});

// Logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("signup out");
    loginCheck(user);
  });
});

// Login
const signInForm = document.querySelector("#login-form");
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  // Authenticate the User
  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    // clear the form
    signInForm.reset();
    // close the modal
    $("#signinModal").modal("hide");
  });
});

//Add new post
const newPost = document.querySelector('#new-post');
newPost.addEventListener('submit', async e => {
  e.preventDefault();

  const file = document.querySelector('#file-img').files[0];
  const title = newPost['title'].value;
  const desc = newPost['desc'].value;


  if (file == null) {
    alert("Debes cargar una imagen")
  } else {
    const name = new Date() + '-' + file.name;

    var urlString = '';

    const metadata = {
      contentType: file.type
    }


    // Upload the file and metadata
    var uploadTask = storageRef.child(name).put(file, metadata);

    uploadTask.then(snapshot => snapshot.ref.getDownloadURL()).then(async url => {
      alert('La imagen se ha subido correctamente');
      urlString = url;

      await fs.collection('posts').doc().set({
        title,
        desc,
        urlString
      });

    });

    newPost.reset();
    newPost['title'].focus();

  }

});


// OnLoadDOM
const postList = document.querySelector(".posts");
let html = "";

window.addEventListener("DOMContentLoaded", async (e) => {


  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("logged");
      checkChanges();

      loginCheck(user);
    } else {
      checkChanges();
      loginCheck(user);
    }
  });
});



//Check changes on Posts
const checkChanges = () => {
  fs.collection('posts').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(changes => {
      if (changes.type == 'added') {
        const post = changes.doc.data();
        const li = `
      <h5 class="title-posts">${post.title}</h5>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        
        <p class="text-justify">${post.desc}</p>
        <img src="${post.urlString}" class="img-fluid img-posts" id="img-posts" alt="...">
      </li>`;
        html += li;
      } else {
        const post = changes.doc.data();
        const li = `
      <h5 class="title-posts">${post.title}</h5>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        
        <p class="text-justify">${post.desc}</p>
        <img src="${post.urlString}" class="img-fluid img-posts" id="img-posts" alt="...">
      </li>`;
        html += li;
      }
    });

    postList.innerHTML = html;
  });
};







