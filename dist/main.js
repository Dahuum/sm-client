"use strict";
axios.get("https://tarmeezacademy.com/api/v1/posts").then((response) => {
    const postsData = response.data.data;
    console.log("the posts data is: ");
    console.log(postsData);
});
