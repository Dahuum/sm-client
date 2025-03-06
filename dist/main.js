"use strict";
const baseUrl = "https://tarmeezacademy.com/api/v1";
let postHtml = document.getElementById("posts");
const DEFAULT_PROFILE_PIC = "https://static.vecteezy.com/system/resources/thumbnails/013/360/247/small/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg";
let currentPage = 1;
let lastPage = 1;
window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 100;
    if (endOfPage && (currentPage <= lastPage))
        showPosts(currentPage++);
});
function fillPost(post, data) {
    post.timeAgo = data.created_at;
    post.username = data.author.username;
    if (Object.keys(data.author.profile_image).length != 0)
        post.profilePic = data.author.profile_image;
    else
        post.profilePic = "https://static.vecteezy.com/system/resources/thumbnails/013/360/247/small/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg";
    if (Object.keys(data.image).length != 0)
        post.postImage = data.image;
    else
        post.postImage = "https://unifirst.ca/wp-content/plugins/unifirst-elementor-addons/assets/images/placeholder.jpg";
    if (data.title != null)
        post.postTitle = data.title;
    else
        post.postTitle = "";
    post.postContent = data.body;
    post.commentsNum = data.comments_count;
}
function postClicked(id) {
    window.location.href = `./post.html?id=${id}`;
}
function showPosts(page = 1) {
    axios.get(`${baseUrl}/posts?limit=4&page=${page}`).then((response) => {
        const posts = response.data.data;
        lastPage = response.data.meta.last_page;
        for (let post of posts) {
            let p = {};
            fillPost(p, post);
            let content = `
        <!-- POST -->
        <div onclick="postClicked(${post.id});" id="post" class="bg-green-50 rounded-lg shadow-lg h-96 mt-10">
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
            if (postHtml)
                postHtml.innerHTML += content;
        }
    });
}
function LoginMessage(message, color) {
    const alertDiv = document.createElement('div');
    alertDiv.id = 'alert-3';
    alertDiv.className = `flex fixed bottom-5 right-5 items-center p-4 m-4 text-green-800 rounded-lg bg-${color} dark:bg-gray-800 dark:text-green-400`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
    <span class="sr-only">Info</span>
    <div class="ms-3 text-lg font-medium">${message}</div>
  `;
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
function updateUI() {
    let userToken = localStorage.getItem("token");
    let loginBtn = document.getElementById("login-btn");
    let signupBtn = document.getElementById("signup-btn");
    let logoutBtn = document.getElementById('logout');
    let addPostBtn = document.getElementById("addBtn");
    let navUsername = document.getElementById('nav-username');
    let navProfilePic = document.getElementById("nav-profilePic");
    if (userToken === null) {
        if (loginBtn)
            loginBtn.style.display = 'block';
        if (signupBtn)
            signupBtn.style.display = 'block';
        if (logoutBtn)
            logoutBtn.style.display = 'none';
        if (addPostBtn)
            addPostBtn.style.display = 'none';
        if (navUsername)
            navUsername.textContent = '@GUEST';
        if (navProfilePic)
            navProfilePic.src = DEFAULT_PROFILE_PIC;
    }
    else {
        if (loginBtn)
            loginBtn.style.display = 'none';
        if (signupBtn)
            signupBtn.style.display = 'none';
        if (logoutBtn)
            logoutBtn.style.display = 'block';
        if (addPostBtn)
            addPostBtn.style.display = 'block';
        if (navUsername)
            navUsername.textContent = `@${localStorage.getItem("username")}`;
        if (localStorage.getItem("profilePicLink") !== null)
            navProfilePic.src = localStorage.getItem("profilePicLink");
        LoginMessage("🎉 Login successful! Redirecting...", "green-100");
    }
}
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicLink");
    LoginMessage("👋 Logged out successfully. See you soon!", "green-100");
    updateUI();
}
function loginClicked() {
    let password = document.querySelector('[data-my-id="pass"]');
    let email = document.querySelector('[data-my-id="mail"]');
    const loginInfo = {
        "username": email.value,
        "password": password.value,
    };
    let userToken;
    const url = `${baseUrl}/login`;
    axios.post(url, loginInfo).then((response) => {
        userToken = response.data.token;
        if (userToken) {
            window.location.reload();
            localStorage.setItem("token", userToken);
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            if (Object.keys(response.data.user.profile_image).length !== 0)
                localStorage.setItem("profilePicLink", response.data.user.profile_image);
            updateUI();
        }
    })
        .catch((error) => {
        LoginMessage("❌ Invalid credentials. Please try again.", "red-400");
    });
}
function signupClicked() {
    let name = document.getElementById("signup-name");
    let mail = document.getElementById("signup-mail");
    let pass = document.getElementById("signup-pass");
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
    let userToken;
    const url = `${baseUrl}/register`;
    axios.post(url, formData, { headers: header }).then((response) => {
        userToken = response.data.token;
        if (userToken) {
            window.location.reload();
            LoginMessage("🎉 Login successful! Redirecting...", "green-100");
            localStorage.setItem("token", userToken);
            localStorage.setItem("username", response.data.user.username);
            if (Object.keys(response.data.user.profile_image).length !== 0)
                localStorage.setItem("profilePicLink", response.data.user.profile_image);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            updateUI();
        }
    })
        .catch((error) => {
        let errors = error.response.data.errors;
        console.log(errors);
        let failed = "";
        if (errors.name)
            failed += `${errors.name[0]}<br/>`;
        if (errors.username)
            failed += `${errors.username}<br/>`;
        if (errors.password)
            failed += `${errors.password}<br/>`;
        if (errors.image)
            failed += `${errors.image}`;
        LoginMessage(failed, "red-400");
    });
}
function addPostClicked() {
    let title = document.getElementById("post-title");
    let content = document.getElementById("post-body");
    let image = document.getElementById("post-image").files[0];
    let formData = new FormData();
    formData.append("title", title.value);
    formData.append("body", content.value);
    formData.append("image", image);
    const token = localStorage.getItem("token");
    const header = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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
    });
}
let postSelected = document.getElementById("postSelected");
const urlParams = new URLSearchParams(window.location.search);
let postID = urlParams.get('id');
function getPostByID(ID) {
    axios.get(`${baseUrl}/posts/${ID}`).then((response) => {
        let comments = response.data.data.comments;
        let post = response.data.data;
        let p = {};
        fillPost(p, post);
        postSelected === null || postSelected === void 0 ? void 0 : postSelected.innerHTML += `
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
            if (comment)
                console.log(comment);
            if (comment)
                console.log("comment username: " + comment.author.username);
            if (comment)
                console.log("comment body: " + comment.body);
            postSelected === null || postSelected === void 0 ? void 0 : postSelected.innerHTML += `
      <!--  Larger Comments Section -->
      <div>
          <div id="one-comment" class="p-8 space-y-5">
              <!--  Comment -->
              <div class="w-full flex-col justify-start items-start gap-8 flex">
                  <div class="w-full pb-6 border-b border-gray-300 justify-start items-start gap-2.5 inline-flex">
                     <img class="w-10 h-10 rounded-full object-cover"   src="${(Object.keys(comment.author.profile_image).length !== 0) ? comment.author.profile_image : DEFAULT_PROFILE_PIC}" />
                      <div class="w-full flex-col justify-start items-start gap-3.5 inline-flex">
                          <div class="w-full justify-start items-start flex-col flex gap-1">
                              <div class="w-full justify-between items-start gap-1 inline-flex">
                                  <h5 id="who-commented" class="text-gray-900 text-sm font-semibold leading-snug">${comment.author.username}</h5>
                              </div>
                              <h5 id="body-of-comment" class="text-gray-800 text-sm font-normal leading-snug">${comment.body}</h5>
                          </div>
                      </div>
      `;
        }
    })
        .catch((error) => {
        console.log(error);
    });
}
getPostByID(postID);
function newCommentBtnClicked() {
    let newComment = document.getElementById("new-comment");
    if (!newComment.value)
        return;
    const url = `${baseUrl}/posts/${postID}/comments`;
    const token = localStorage.getItem("token");
    const header = {
        "authorization": `Bearer ${token}`,
    };
    let formData = new FormData();
    formData.append("body", newComment.value);
    axios.post(url, formData, { headers: header }).then((response) => {
        window.location.reload();
    })
        .catch((error) => {
        LoginMessage(error.response.data.message, "red-400");
    });
}
showPosts();
updateUI();
