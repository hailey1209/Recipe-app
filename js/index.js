const scroller = new Scroller(false) // 스크롤 객체 생성

window.addEventListener('load', function(e){

    // 모드변경
    const mode = document.querySelector('.mode')
    const header =document.querySelector('header')
    mode.addEventListener('click', function(e){
        if(e.target.classList.contains('active')){
            document.body.classList.toggle('dark')
            header.classList.toggle('dark')
        }
    })

    // API 데이터

    function loadApi(url){
         return fetch(url)
        .then(response => response.json())
        .then(data => data.meals)
    }
    function showData(data){
        return new Promise(function (resolve, reject){
            resolve('success!')
            createContent(data)
            function createContent(data){
                for(let i=0; i <data.length; i++){
                     // 컨텐츠 생성
                    const searchResult = document.querySelector('main .main-top .result .result-items')
                    const resultItem = document.createElement('div')
                    resultItem.className = 'item'
                    resultItem.innerHTML = `
                            <img src="${data[i].strMealThumb}" alt="food img">
                            <h3>${data[i].strMeal}</h3>
                            <button class="${i}">Get Recipe</button>`
                    searchResult.appendChild(resultItem)
        
                    const itemModal = document.createElement('div')
                    itemModal.className = (`item-modal ${[i]}`)
                    itemModal.innerHTML = `
                        <button class="close-btn"><span>x</span></button>
                        <div class="content">
                            <p>${data[i].strMeal}</p>
                            <p>${data[i].strCategory}</p>
                            <p>Instructions: </p>
                            <p>${data[i].strInstructions}</p>
                            <img src="${data[i].strMealThumb}" alt="">
                            <button class="video-btn"><a href="${data[i].strYoutube}">Whatch video</button> 
                            </div>`
                        searchResult.appendChild(itemModal)

                     //무한 스크롤
                    window.addEventListener('scroll', function(e){
                        // const resultList = document.querySelector('.result-box')
                        const scrollHeight =  Math.max(   // 전체문서 높이 (스크롤이벤트 내부에 있어야 함)
                        document.body.scrollHeight, document.documentElement.scrollHeight,
                        document.body.offsetHeight, document.documentElement.offsetHeight,
                        document.body.clientHeight, document.documentElement.clientHeight
                        );
                        // console.log(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight))
                        if(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight) < 100){
                        console.log('scroll is bottom of browser')
                        createContent(data)
                        }
                    })
                     // 아이템 모달창 이벤트
                     const getRecipeBtns = document.querySelectorAll('main .main-top .result .item button')
                     const resipeModals = document.querySelectorAll('main .main-top .result .result-items .item-modal')
                     const modalCloseBtns = document.querySelectorAll('main .main-top .result .result-items .item-modal .close-btn')
                     
                     function openModal(e){
                         console.log(scrollY)
                         if(e.target.classList.contains(i)){
                             resipeModals[i].style.display = 'block'
                            //  document.body.style =`position: fixed; top: -${scrollY+50}px; bottom: 0;`
                         }
                     }
                     function closeModal(e){
                         console.log(e.target)
                         if(e.target.innerText === 'x'){
                             resipeModals[i].style.display = 'none'
                             document.body.style =`position: relative;`
                         }
                     }
                     getRecipeBtns[i].addEventListener('click', openModal)
                     modalCloseBtns[i].addEventListener('click', closeModal)
 
                     const videoLink = document.querySelectorAll('main .main-top .result .result-items .item-modal .video-btn')
                     const vidoes = document.querySelectorAll('main .main-top .result .result-items .item-modal .video')
 
                     videoLink[i].addEventListener('click', function(e){
                         if(e.target.classList.contains('video-btn')){
                             vidoes[i].style.display = 'block'
                             videoLink[i].style.display = 'none'
                         } 
                     })
                }
               
                window.addEventListener('scroll', function(){
                    const header = document.querySelector('header')
                    //스크롤링중에 어느정도 스크롤바를 내리면 헤더에 그림자 추가
                    scroller.getScrollPosition() > header.offsetHeight ? 
                    header.classList.add('active')
                    : header.classList.remove('active')
                })
            }

            // 검색기능
            const searchBar = document.querySelector('main .main-top .search .search-bar')
            const searchedItems = document.querySelectorAll('main .main-top .result .item')
            
            searchBar.addEventListener('keyup', function(e){
                for(let i=0; i < searchedItems.length; i++){
                    console.log(searchBar.value)
                    searchedItems[i].style.display = 'none'
                    const name = searchedItems[i].querySelector('main .main-top .result .item h3')
                    console.log(name.innerText.toLowerCase())
                    if(name.innerText.toLowerCase().includes(e.target.value) || e.target.value == ' ' || e.target.value == null){
                        searchedItems[i].style.display = 'block'
                    } else {
                        searchedItems[i].style.display = 'none'
                    }
                }
            })

        })
    }
    loadApi('https://www.themealdb.com/api/json/v1/1/search.php?s=s')
    .then(data => showData(data))
})

// api fetch를 두번 반복해서 작성했기 때문에 처음 로딩 속도가 느렸음
//  중복되는 fetch코드를 삭제 하니 속도가 빨라짐