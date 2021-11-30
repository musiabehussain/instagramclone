import { ApiHelper } from "./api-helper.js";



export class Posts {
  constructor() {
    this.state = {
      posts: [],
      isLoadingPosts: false,
    };
    this.apiHepler = new ApiHelper();
  }


  seState(newState) {
    this.state = newState;
  }

  async getPosts() {
    this.seState({ ...this.state, isLoadingPosts: true });
    const posts = await this.apiHepler.fetchFromPortal("/posts", 'GET');
    this.seState({ ...this.state, isLoadingPosts: false, posts });
    this.render();
  }

  //   handleUpdate(id) {
  // console.log(id)
  // const {posts} = this.state
  // console.log(posts)
  //     const stde = posts.find((x) => x.id === id);
  //     console.log(stde)
  //     if (stde) {
  //       studentApp.state.newState = stde;
  //       studentApp.handeStudentform(id);
  //     }
  //   }


  async handeStudentform(std) {
    const { posts } = this.state;
    const model = document.querySelector("#FormShow");
    const form = `
  <form action="" id="form">

  <input type="text" id="title-input" value  = "${std ? posts[std].title : ""}">
  <input type="text" id="body-input"   value=" ${std ? posts[std].body : ""}">
  <button id="form-btn" > ${std ? "update" : "create"}</button>
</form>
  `
    model.innerHTML = form
    // this.handleUpdate(id)

  }

  async getPostComments(id) {

    const { posts } = this.state
    const postComments = await this.apiHepler.fetchFromPortal(`/posts/${id}/comments`, 'GET')
    const index = posts.findIndex(x => x.id === Number(id))
    console.log({ index })
    if (index > -1) {
      const postsState = [...posts]
      postsState[index].comments = postComments
      this.seState({ ...this.state, posts: postsState })
      this.render()
    }
  }

  handleForm(id) {
    const { posts } = this.state
    const index = posts.findIndex(x => x.id === Number(id))
    console.log({ index })
    if (index > -1) {
      document.querySelector('#title-input').value = posts[index].title
      document.querySelector('#body-input').value = posts[index].body
    }

  }


  async delete(id) {
    const dle = await this.apiHepler.fetchFromPortal(`/posts/${id}`, 'DELETE')
    console.log(dle)
    console.log("ok");
    this.render()
  }

  // view(){
  //   const { posts } = this.state;

  //   const 

    
  // }
  
  render() {
    const { posts, isLoadingPosts } = this.state;
    const postsList = document.querySelector("#posts-list");
    console.log({ posts })
    postsList.innerHTML = isLoadingPosts
      ? "<div>Loading...</div>"
      : posts
        .map((post) => {

          return `
            
                <div class="post-card">
                <div   class= "instaimage"   >
<img src="./images/9a18d83c67150471d24fbc8609e7cb5c.jpg" alt="">
              
<i id="show"  data-tag-id="${post.id}-view"    class="fas fa-ellipsis-v"></i>




<h4   class = "imageid"  >${post.user.full_name}</h4>
 </div>
 <img  class="mainimage" src="./images/0ed390e0dfbf7b7c750d12ab8af3f9c0.jpg" alt="">

                <div   class="mainicons"> 
                <i class="far fa-heart"></i>
                <i class="far fa-comment"></i>
                <i class="fas fa-location-arrow"></i>
                <i class="far fa-bookmark"></i>


                </div>
                    <div  >${post.id}</div>


                 
                    <h4>${post.user.profile_pic_id}</h4>




                    ${post.comments ? `<div class="post-comments">
                      <p>Comments</p>
                    ${post.comments.map((comment, index) => {
            return `<div class="comment-card">${index + 1}: ${comment.name}</div>`
          }).join("")}</div>`


              :
              `<div    class="link" data-tag-id="${post.id}">View comments</div>`}



                    <span id ="btnsview" class="post-buttons">

                        <span  style="  margin-right:30px ;"  class="iconbtn"  class="btnlink"   ><i class="fas fa-link"></i>
                        </span>

                        <span  style="  margin-right:30px ;"  class="iconbtn" class="btnshare" data-tag-id="${post.id}-update"> <i class="fas fa-share-alt"></i>
                        </span>


                        
                        <span  style="  margin-right:30px ;"   class="iconbtn"   class="btnliner" data-tag-id="${post.id}-delete"> <i class="fas fa-external-link-alt"></i>
                        </span>
                    </div>

                </div>
            `;
        })
        .join("");

    postsList.addEventListener('click', (e) => {
      const target = e.target.dataset.tagId

      if (!isNaN(target)) {
        this.getPostComments(target)
      }
      if (target.split("-")[1] === 'update') {
        const id = target.split("-")[0]
        if (id) {
          this.handeStudentform(id)
        }
      }
      if (target.split("-")[1] === 'delete') {
        const id = target.split("-")[0]
        if (id) {
          this.delete(id)
        }

      }
      if (target.split("-")[1] === 'delete') {
        const id = target.split("-")[0]
        if (id) {
          this.view(id)
        }

      }
    })
  }




  init() {
    this.getPosts();
    this.render();
    this.handeStudentform()
    // this.changeDisplay();

  }
}
