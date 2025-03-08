// import { initModals } from 'flowbite';

type int = number; /* i think it's better right ? */

const baseUrl: string = "https://tarmeezacademy.com/api/v1";
let postHtml = document.getElementById("posts");
const DEFAULT_PROFILE_PIC = "https://static.vecteezy.com/system/resources/thumbnails/013/360/247/small/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg";
let currentPage: int = 1;
let lastPage: int = 1;

interface Post {
  timeAgo: (string);
  username: (string | int);
  profilePic?: (string | object);
  postImage?: (string);
  postTitle: (string | int);
  postContent: (string | int);
  commentsNum?: (int);
}

/* HANDLE INFINITE SCROLLING */
window.addEventListener("scroll", function(){
  const endOfPage = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 100; // adding buffer  console.log(endOfPage);
  if (endOfPage && (currentPage <= lastPage)) showPosts(currentPage++);
})
/* // HANDLE INFINITE SCROLLING // */

function goToHomePage(): void {
  window.location.href = "./";
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

function postClicked(id: int) : void {
  window.location.href = `./post.html?id=${id}`;
}

function showPosts(page: number = 1): void {
  axios.get(`${baseUrl}/posts?limit=4&page=${page}`).then((response) => {
    const posts = response.data.data;
    lastPage = response.data.meta.last_page;
    
    for (let post of posts) {
      let p = {} as Post;
      fillPost(p, post);
      let content = `
        <!-- POST -->
        <div id="post" class="bg-green-50 rounded-lg shadow-lg h-96 mt-16">
            <div class="flex items-center justify-between p-2 border-b-2 bg-green-50 rounded-t-lg">
              <div class="flex items-center space-x-1">
                <img src="${p.profilePic}" class="w-5 h-5 rounded-2xl ml-3" alt="Profile pic">
                <button  onclick="goToProfile(${post.author.id})" class="text-sm font-bold">@${p.username}</button>
                <h3 class="text-zinc-50 text-xs self-center pl-2">${p.timeAgo}</h3>
              </div>
              <div>
              <button id="deleteBTN" onclick="deletePost(${post.id});" class="mr-2 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button id="editBTN"  data-modal-target="editPost" data-modal-toggle="editPost" onclick="editPostClicked(${post.id});"  class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              </div>
            </div>
            <div class="flex justify-center items-center border-b-2  h-96 bg-green-50">
                <img src="${p.postImage}" class=" object-cover rounded-lg h-full w-full p-1 ">
            </div>
            <div class="border-b-2 h-20 px-4 py-2">
                <h3 class="text-xl font-bold text-gray-800">${p.postTitle}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">${p.postContent}</p>                    
            </div>
            <!--  Larger Comments Button -->
            <button onclick="postClicked(${post.id});" class="w-full py-4 bg-green-500 hover:bg-green-600 text-gray-800 rounded-b-lg shadow-lg transition-colors duration-300 flex items-center justify-center space-x-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                </svg>
                <span class="font-semibold">View Comments (${p.commentsNum})</span>
              </button>
        </div>
        <!--// POST //-->
        `;
      if (postHtml) postHtml.innerHTML += content;
    } 
    if (typeof window.initFlowbite === 'function') {
      window.initFlowbite();
    } else {
      console.error('Flowbite not found. Make sure it is properly loaded.');
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
  let navUsername = document.getElementById('nav-username');
  let navProfilePic = document.getElementById("nav-profilePic") as HTMLImageElement;
  let editBTN = document.getElementById("editBTN");
  let deleteBTN = document.getElementById("deleteBTN");
  
  if (userToken === null)
  {
    if (loginBtn) loginBtn.style.display = 'block';
    if (signupBtn) signupBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (addPostBtn) addPostBtn.style.display = 'none';
    if (navUsername) navUsername.textContent = '@GUEST';
    if (editBTN) editBTN.style.display = 'none';
    if (deleteBTN) deleteBTN.style.display = 'none';
    if (navProfilePic) navProfilePic.src = DEFAULT_PROFILE_PIC;
    
  }
  else 
  {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (addPostBtn) addPostBtn.style.display = 'block';
    if (editBTN) editBTN.style.display = 'block';
    if (deleteBTN) deleteBTN.style.display = 'block';
    if (navUsername) navUsername.textContent = `@${localStorage.getItem("username")}`;
    if (localStorage.getItem("profilePicLink") !== null) 
      navProfilePic.src = localStorage.getItem("profilePicLink") as string;
    LoginMessage("🎉 Login successful! Redirecting...", "green-100");
  }
}

function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("username");
  localStorage.removeItem("profilePicLink");
  localStorage.removeItem("id");
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
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("id", response.data.user.id);
      if (Object.keys(response.data.user.profile_image).length !== 0)
        localStorage.setItem("profilePicLink", response.data.user.profile_image);
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
  let profilePic = document.getElementById("profilePic").files[0];
  
  console.log(name.value);
  console.log(mail.value);
  console.log(pass.value);
  
  let formData = new FormData();
  formData.append("username", mail.value);
  formData.append("password", pass.value);
  formData.append("name", name.value);
  formData.append("image", profilePic);
  
  let header = {
    'Content-Type': 'multipart/form-data',
  };
  let userToken: string;
  const url = `${baseUrl}/register`;
  axios.post(url, formData, {headers: header}).then((response) => {
    userToken = response.data.token;
    if (userToken) {
      window.location.reload();
      LoginMessage("🎉 Login successful! Redirecting...", "green-100");
      localStorage.setItem("token", userToken);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("id", response.data.user.id);
      if (Object.keys(response.data.user.profile_image).length !== 0)
        localStorage.setItem("profilePicLink", response.data.user.profile_image)
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
    if (errors.image) failed += `${errors.image}`
    LoginMessage(failed, "red-400");
  })
}

function addPostClicked(): void {
  let title = document.getElementById("post-title") as HTMLInputElement;
  let content = document.getElementById("post-body") as HTMLInputElement;
  let image = document.getElementById("post-image").files[0];
  
  let formData = new FormData();
  formData.append("title", title.value);
  formData.append("body", content.value);
  /* TODO: 39el 3la l post picture khassha dar bchi tari9a ou safy  */
  formData.append("image", image);

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

function editPostClicked(ID: int): void {
  window.history.pushState({id: ID}, '', `?id=${ID}`);
  let title = document.getElementById("old-post-title") as HTMLInputElement;
  let body = document.getElementById("old-post-body") as HTMLInputElement;
  title.innerHTML = "hello";
  console.log("Edit Post Clicked With ID: " + ID);
  axios.get(`${baseUrl}/posts/${ID}`).then((response) => {
    let post = response.data.data;
    console.log(title)
    title.value = post.title;
    body.value = post.body;
    console.log(post);
  })
}

function editPost(): void {
  const urlParams = new URLSearchParams(window.location.search);
  let postID: int = urlParams.get("id");
  urlParams.delete("id");
  
  let title = document.getElementById("old-post-title") as HTMLInputElement;
  let body = document.getElementById("old-post-body") as HTMLInputElement;
  
  let param = {
    "title": title.value,
    "body": body.value,
  }
  
  const token = localStorage.getItem("token");
  const header = {
    "authorization": `Bearer ${token}`,
  };
  axios.put(`${baseUrl}/posts/${postID}`, param, {headers: header}).then((response) => {
    setTimeout(() => {
      // Create a new URL without the ID parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("id");
            
      // Update the URL without reloading the page
      window.history.pushState({}, '', newUrl.toString());
            
       // Now reload the page with the new URL (without the ID)
      window.location.href = newUrl.toString();
    }, 1000)
    LoginMessage("Post edited successfully!", "green-100");
  })
  .catch((error) => {
    LoginMessage(error.response.data.error_message, "red-400");
  })
}

function deletePost(ID: int): void {
  const token = localStorage.getItem("token");
  const header = {
    "authorization": `Bearer ${token}`,
  };
  
  axios.delete(`${baseUrl}/posts/${ID}`, {headers: header}).then((response) => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    LoginMessage("Post deleted successfully!", "red-100");
  })
  .catch((error) => {
    LoginMessage(error.response.data.error_message, "red-400");
  })
}

function goToProfile(id: int): void {
  window.location.href = `./profile.html?profileID=${id}`;
}

function getProfileByID(id: int): void {
  // let userPost = document.getElementById("UserPost");
  let mainContent = document.getElementById("mainContent");
  
  /* get profile infos, name, username ... */
  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    // console.log(response.data.data);
    mainContent?.innerHTML += `
    <div class="mx-2 my-10 rounded-xl border bg-white px-4 shadow-md sm:mx-auto sm:max-w-xl sm:px-8">
      <div class="mb-2 flex flex-col gap-y-6 border-b py-8 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center">
          <img class="h-14 w-14 rounded-full object-cover" src="${response.data.data.profile_image || DEFAULT_PROFILE_PIC}"/>
          <div class="ml-4 w-56">
            <p class="text-slate-800 text-xl font-extrabold">@${response.data.data.username}</p>
            <p class="text-slate-500">${response.data.data.name}</p>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <p class="text-slate-700 mb-1 text-xl font-extrabold">${response.data.data.posts_count}</p>
          <p class="text-slate-500 text-sm font-medium">Posts</p>
        </div>
        <div class="flex flex-col items-center">
          <p class="text-slate-700 mb-1 text-xl font-extrabold">${response.data.data.comments_count}</p>
          <p class="text-slate-500 text-sm font-medium">Comments</p>
        </div>
      </div>
      <div class="mb-2 flex justify-between  py-8 text-sm sm:text-base">
        <div class="flex flex-col space-y-3">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-slate-700">${response.data.data.email || "---------"}</span>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-slate-700">@${response.data.data.username}</span>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-slate-700">${response.data.data.name}</span>
          </div>
        </div>
      </div>
    </div>
    `
  })
  .catch((error) => {
    console.log(error);
  })
  /* get profile infos, name, username ... */

  /* get profile posts */
  axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
    let userPosts = response.data.data;
    console.log("hello world");
    console.log (userPosts);
    
    for (let post of userPosts) {
      let p = {} as Post;
      fillPost(p, post);
      console.log("inside loop");
      console.log(p);
      let content = `
        <!-- POST -->
        <div id="post" class="bg-green-50 rounded-lg shadow-lg h-96 mt-16">
            <div class="flex items-center justify-between p-2 border-b-2 bg-green-50 rounded-t-lg">
              <div class="flex items-center space-x-1">
                <img src="${p.profilePic}" class="w-5 h-5 rounded-2xl ml-3" alt="Profile pic">
                <button onclick="goToProfile(${post.author.id})" class="text-sm font-bold">@${p.username}</button>
                <h3 class="text-zinc-50 text-xs self-center pl-2">${p.timeAgo}</h3>
              </div>
              <div>
              <button id="deleteBTN" onclick="deletePost(${post.id});" class="mr-2 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button id="editBTN"  data-modal-target="editPost" data-modal-toggle="editPost" onclick="editPostClicked(${post.id});"  class="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              </div>
            </div>
            <div class="flex justify-center items-center border-b-2  h-96 bg-green-50">
                <img src="${p.postImage}" class=" object-cover rounded-lg h-full w-full p-1 ">
            </div>
            <div class="border-b-2 h-20 px-4 py-2">
                <h3 class="text-xl font-bold text-gray-800">${p.postTitle}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">${p.postContent}</p>                    
            </div>
            <!--  Larger Comments Button -->
            <button onclick="postClicked(${post.id});" class="w-full py-4 bg-green-500 hover:bg-green-600 text-gray-800 rounded-b-lg shadow-lg transition-colors duration-300 flex items-center justify-center space-x-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                </svg>
                <span class="font-semibold">View Comments (${p.commentsNum})</span>
              </button>
        </div>
        <!--// POST //-->
        `;
      mainContent.innerHTML += content;
    }
  }).catch((error) => {
    console.log(error);
  });
  /* get profile posts */

}

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('profileID');
  console.log("user id: " + userId);
  if (userId) {
    getProfileByID(Number(userId));
  } else {
    console.error("No user ID provided in URL");
  }
});
// document.addEventListener('DOMContentLoaded', getProfileByID);
/* POST PAGE SECTION */

let postSelected = document.getElementById("postSelected");
/* post id to comment in the right post */
const urlParams = new URLSearchParams(window.location.search);
let postID: int = urlParams.get('id');

function getPostByID(ID: int): void {
  axios.get(`${baseUrl}/posts/${ID}`).then((response) => {
    let comments = response.data.data.comments;
    let post = response.data.data;
    
    let p = {} as Post;
    fillPost(p, post);
    postSelected?.innerHTML += `
        <div class="flex space-x-1 p-2 border-b-2 bg-green-50 rounded-t-lg">
            <img src="${p.profilePic}" class="w-5 h-5 rounded-2xl ml-3" alt="Profile pic">
            <button onclick="goToProfile(${post.author.id})" class="text-sm font-bold ">@${p.username}</button>
            <h3 class="text-zinc-50 text-xs self-center  pl-2 ">${p.timeAgo}</h3>
        </div>
        <div class="flex justify-center items-center border-b-2  h-96 bg-green-50">
            <img src="${p.postImage}" class=" object-cover rounded-lg h-full w-full p-1 ">
        </div>
        <div class="border-b-2 h-20 px-4 py-2">
            <h3 class="text-xl font-bold text-gray-800">${p.postTitle}</h3>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">${p.postContent}</p>                    
        </div>
        <div id="one-comment" class="p-8 space-y-5">
            <!-- Comment Input Box -->
            <div class="w-full relative flex justify-between gap-2">
               <input id="new-comment" type="text" class="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed" placeholder="Write comments here....">
                    <button onclick="newCommentBtnClicked()" id="new-comment-btn" class="absolute right-6 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M11.3011 8.69906L8.17808 11.8221M8.62402 12.5909L8.79264 12.8821C10.3882 15.638 11.1859 17.016 12.2575 16.9068C13.3291 16.7977 13.8326 15.2871 14.8397 12.2661L16.2842 7.93238C17.2041 5.17273 17.6641 3.79291 16.9357 3.06455C16.2073 2.33619 14.8275 2.79613 12.0679 3.71601L7.73416 5.16058C4.71311 6.16759 3.20259 6.6711 3.09342 7.7427C2.98425 8.81431 4.36221 9.61207 7.11813 11.2076L7.40938 11.3762C7.79182 11.5976 7.98303 11.7083 8.13747 11.8628C8.29191 12.0172 8.40261 12.2084 8.62402 12.5909Z"
                          stroke="#111827" stroke-width="1.6" stroke-linecap="round" />
                      </svg>
                    </button>
            </div>
        </div>
    `;
    for (let comment of comments) {
      // if (comment) console.log(comment);
      // if (comment) console.log("comment username: " + comment.author.username);
      // if (comment) console.log("comment body: " + comment.body);
      
      postSelected?.innerHTML += `
      <!--  Larger Comments Section -->
      <div>
          <div id="one-comment" class="p-8 space-y-5">
              <!--  Comment -->
              <div class="w-full flex-col justify-start items-start gap-8 flex">
                  <div class="w-full pb-6 border-b border-gray-300 justify-start items-start gap-2.5 inline-flex">
                     <img class="w-10 h-10 rounded-full object-cover"   src="${(Object.keys(comment.author.profile_image).length !== 0) ? comment.author.profile_image   : DEFAULT_PROFILE_PIC }" />
                      <div class="w-full flex-col justify-start items-start gap-3.5 inline-flex">
                          <div class="w-full justify-start items-start flex-col flex gap-1">
                              <div class="w-full justify-between items-start gap-1 inline-flex">
                                  <h5 id="who-commented" class="text-gray-900 text-sm font-semibold leading-snug">${comment.author.username}</h5>
                              </div>
                              <h5 id="body-of-comment" class="text-gray-800 text-sm font-normal leading-snug">${comment.body}</h5>
                          </div>
                      </div>
      `
    }
  })
  .catch((error) => {
    console.log("there is an error");
  })
}
getPostByID(postID);

function newCommentBtnClicked(): void {
  let newComment = document.getElementById("new-comment") as HTMLInputElement;
  if (!newComment.value) return ;
  
  const url = `${baseUrl}/posts/${postID}/comments`;

  const token = localStorage.getItem("token");
  const header = {
    "authorization": `Bearer ${token}`,
  };
  let formData = new FormData();
  formData.append("body", newComment.value);
  
  axios.post(url, formData, {headers: header}).then((response) => {
    window.location.reload();
  })
  .catch((error) => {
    LoginMessage(error.response.data.message, "red-400");
  })
}


/* // POST PAGE SECTION // */
showPosts();
updateUI();
// initModals();
