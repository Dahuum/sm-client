type int = number; /* i think it's better right ? */

const baseUrl: string = "https://tarmeezacademy.com/api/v1";
let postHtml = document.getElementById("post");


interface Post {
  timeAgo: (string);
  username: (string | int);
  profilePic?: (string | object);
  postImage?: (string);
  postTitle: (string | int);
  postContent: (string | int);
  commentsNum?: (int);
}

function fillPost(post: Post, data: any): void{
  post.timeAgo = data.created_at;
  post.username = data.author.username;
  if (Object.keys(data.author.profile_image).length != 0) post.profilePic = data.author.profile_image;
  else post.profilePic = "https://static.vecteezy.com/system/resources/thumbnails/013/360/247/small/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg";
  if (Object.keys(data.image).length != 0) post.postImage = data.image;
  else post.postImage = "https://unifirst.ca/wp-content/plugins/unifirst-elementor-addons/assets/images/placeholder.jpg";
  if (data.title != null) post.postTitle = data.title;
  else post.postTitle = "";
  post.postContent = data.body;
  post.commentsNum = data.comments_count;
}

function showPosts(): void {
  axios.get(`${baseUrl}/posts`).then((response) => {
    const posts = response.data.data;
    
    for (let post of posts) {
      let p = {} as Post;
      fillPost(p, post);
      let content = `
        <!-- POST -->
        <div id="post" class="bg-green-50 rounded-lg shadow-lg h-96 mt-10">
            <div class="flex space-x-1 p-2 border-b-2 bg-green-50 rounded-t-lg">
                <img src="${p.profilePic}" class="w-5 h-5 rounded-2xl ml-3" alt="Profile pic">
                <h3 class="text-sm font-bold ">@${p.username}</h3>
                <h3 class="text-zinc-50 text-xs self-center  pl-2 ">${p.timeAgo}</h3>
            </div>
            <div class="flex justify-center items-center border-b-2  h-96 bg-green-50">
                <img src="${p.postImage}" class=" object-cover rounded-lg h-full w-full p-1 ">
            </div>
            <div class="border-b-2 h-20 px-4 py-2">
                <h3 class="text-xl font-bold text-gray-800">${p.postTitle}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">${p.postContent}</p>                    
            </div>
            <!--  Larger Comments Button -->
            <button class="w-full py-4 bg-green-500 hover:bg-green-600 text-gray-800 rounded-b-lg shadow-lg transition-colors duration-300 flex items-center justify-center space-x-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                </svg>
                <span class="font-semibold">View Comments (${p.commentsNum})</span>
              </button>
        </div>
        <!--// POST //-->
        `;
      if (postHtml)postHtml.innerHTML += content;
    } 
  });
}


function LoginMessage(message: string, color: any): void {
  const alertDiv = document.createElement('div');
  alertDiv.id = 'alert-3';
  alertDiv.className = `flex fixed bottom-5 right-5 items-center p-4 m-4 text-green-800 rounded-lg bg-${color} dark:bg-gray-800 dark:text-green-400`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    <span class="sr-only">Info</span>
    <div class="ms-3 text-lg font-medium">${message}</div>
  `
  alertDiv.style.transition = 'opacity 0.3s ease-in';
  alertDiv.style.opacity = '0';
  document.body.append(alertDiv);
  
  void alertDiv.offsetWidth;
  alertDiv.style.opacity = '1';
  
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    setTimeout(() => {
      alertDiv.remove();
    }, 300);
  }, 2000);
}

function updateUI(): void {
  let userToken = localStorage.getItem("token");
  /* buttunat */
  let loginBtn = document.getElementById("login-btn");
  let signupBtn = document.getElementById("signup-btn");
  let logoutBtn = document.getElementById('logout');
  let addPostBtn = document.getElementById("addBtn");
  
  if (userToken === null)
  {
    if (loginBtn) loginBtn.style.display = 'block';
    if (signupBtn) signupBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (addPostBtn) addPostBtn.style.display = 'none';
  }
  else 
  {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (addPostBtn) addPostBtn.style.display = 'block';
    LoginMessage("🎉 Login successful! Redirecting...", "green-100");
  }
}

function logout(): void {
  
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  LoginMessage("👋 Logged out successfully. See you soon!", "green-100");
  updateUI();
}

function loginClicked(): void {
  let password = document.querySelector('[data-my-id="pass"]') as HTMLInputElement;
  let email = document.querySelector('[data-my-id="mail"]') as HTMLInputElement;  
  
  const loginInfo = {
    "username": email.value,
    "password": password.value,
  };
  let userToken: string;
  const url = `${baseUrl}/login`;
  axios.post(url, loginInfo).then((response) => {
    userToken = response.data.token;
    
    if (userToken) {
      window.location.reload();
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      updateUI();
    }
  })
  .catch((error) => {
    LoginMessage("❌ Invalid credentials. Please try again.", "red-400");
  })
}

function signupClicked(): void {
  let name = document.getElementById("signup-name") as HTMLInputElement;
  let mail = document.getElementById("signup-mail") as HTMLInputElement;
  let pass = document.getElementById("signup-pass") as HTMLInputElement;
  
  console.log(name.value);
  console.log(mail.value);
  console.log(pass.value);
  
  const register = {
    "username": mail.value,
    "password": pass.value,
    "name": name.value
  };
  let userToken: string;
  const url = `${baseUrl}/register`;
  axios.post(url, register).then((response) => {
    userToken = response.data.token;
    
    if (userToken) {
      window.location.reload();
      LoginMessage("🎉 Login successful! Redirecting...", "green-100");
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      updateUI();
    }
  })
  .catch((error) => {
    let errors = error.response.data.errors;
    console.log(errors);
    let failed: string = "";
    if (errors.name) failed += `${errors.name[0]}<br/>`;
    if (errors.username) failed += `${errors.username}<br/>`;
    if (errors.password) failed += `${errors.password}<br/>`;
    LoginMessage(failed, "red-400");
  })
}

function addPostClicked(): void {
  let title = document.getElementById("post-title") as HTMLInputElement;
  let content = document.getElementById("post-body") as HTMLInputElement;
  // let image = document.getElementById("post-image").files[0];
  
  let formData = new FormData();
  formData.append("title", title.value);
  formData.append("body", content.value);
  /* TODO: 39el 3la l post picture khassha dar bchi tari9a ou safy  */
  /* formData.append("image", image); */

  const token = localStorage.getItem("token");
  const header = {
    "authorization": `Bearer ${token}`,
    "Content-Type": "multipart/form-data", // Content-Type: multipart/form-data;
  };
  const url = `${baseUrl}/posts`;
  axios.post(url, formData, { headers: header }).then((response) => {
    setTimeout(() => {
    window.location.reload();
    }, 1000);
    LoginMessage("🎉 Post created and shared successfully!", "green-100");

  })
    .catch((error) => {
      console.log(error.response.data.message);
      LoginMessage(error.response.data.message, "red-400");
    })
}

showPosts();
updateUI();