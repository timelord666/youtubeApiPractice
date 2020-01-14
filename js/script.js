'use strict';

document.addEventListener('DOMContentLoaded', () => {
    //keyboard
    {
        const keyboardBtn = document.querySelector('.search-form__keyboard'),
              keyboardClose = document.querySelector('.keboard__close'),
              keyboard = document.querySelector('.keyboard'),
              searchInput = document.querySelector('.search-form__input');

        const toggleKeyboard = () => keyboard.style.top = keyboard.style.top ? '' : '50%';
        function changeLang(buttons, lang) {
            const langRu = [
                'ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '<',
                'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
                'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
                'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
                'en', ' '
            ];
            const langEn = [
                '`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '<',
                'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
                'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
                'ru', ' '
            ];


            if (lang === 'en') {
                buttons.forEach((elem, i) => {
                    elem.textContent = langEn[i];
                })
            } else {
                buttons.forEach((elem, i) => {
                    elem.textContent = langRu[i];
                })
            }
        }
        const typing = e => {
            const target = e.target;
            if (target.tagName.toLowerCase() === 'button') {
                const buttons = [...keyboard.querySelectorAll('button')]
                .filter(elem => elem.style.visibility !== 'hidden');

                
                const btnTxt = target.textContent.trim();

                if (target.id === 'keyboard-backspace') {
                    searchInput.value = searchInput.value.slice(0, -1);
                } else if (!btnTxt) {
                    searchInput.value += ' ';
                } else if (btnTxt === 'en' || btnTxt === 'ru') {
                    changeLang(buttons, btnTxt);
                } else {
                    searchInput.value += btnTxt;
                }
                
                
            }
            
        };

        keyboardBtn.addEventListener('click', toggleKeyboard);
        keyboardClose.addEventListener('click', toggleKeyboard);
        keyboard.addEventListener('click', typing);


              
    }


    //menu
    {
        const burger = document.querySelector('.spinner'),
              sidebarMenu = document.querySelector('.sidebarMenu');

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            sidebarMenu.classList.toggle('rollUp');
        });

        sidebarMenu.addEventListener('click', e => {
            let target = e.target;
            target = target.closest('a[href="#"]');

            if (target) {
                const parentTarget = target.parentNode;
                sidebarMenu.querySelectorAll('li').forEach(elem => {
                    if (elem === parentTarget) {
                        elem.classList.add('active');
                    } else {
                        elem.classList.remove('active');
                    }
                });
            }
        });







    }

    //modal window



    function ytModal() {
        
    
        const youtuberModal = document.querySelector('.youTuberModal'),
              youtuberItems = document.querySelectorAll('[data-youtuber]'),
              youtuberContainer = document.querySelector('#youtuberContainer');
              
        const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256],
              qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

        


            function sizeVideo() {
                let ww = document.documentElement.clientWidth,
                    wh = document.documentElement.clientHeight;

                for (let i = 0; i < qw.length; i++) {
                    if (ww > qw[i]) {
                        youtuberContainer.querySelector('iframe').style.cssText = `
                            width:${qw[i]}px;
                            height:${qh[i]}px;
                        `;
                        youtuberContainer.style.cssText = `
                            width:${qw[i]}px;
                            height:${qh[i]}px;
                            top:${(wh - qh[i]) / 2}px;
                            left:${(ww - qw[i]) / 2}px;
                        `;



                        break;
                    }
                    
                }    
            }



        youtuberItems.forEach(elem => elem.addEventListener('click', () => {
            const idVid = elem.dataset.youtuber;
            //youtuberModal.style.display = 'block';
            youtuberModal.style.transition = '0.5s';
            youtuberModal.style.width = '100%';
            youtuberModal.style.height = '100vh';
            // for (let i = 0; i <= 100; i++) {
            //     setTimeout(() => {
            //      youtuberModal.style.width = `${i}%`;
            //      youtuberModal.style.height = `${i}vh`;
            //     }, 5);


            //}

            const youtuberFrame = document.createElement('iframe');
            youtuberFrame.src = `https://youtube.com/embed/${idVid}`;
            youtuberContainer.insertAdjacentElement('beforeend', youtuberFrame);
            window.addEventListener('resize', sizeVideo);
            sizeVideo();

        }));
        youtuberModal.addEventListener('click', () => {
            //youtuberModal.style.display = 'none';
            youtuberModal.style.width = '0%';
            youtuberModal.style.height = '0vh';
            youtuberContainer.textContent = '';
            window.removeEventListener('resize', sizeVideo);
        });


    }

    {
        document.body.insertAdjacentHTML('beforeend', ` 
         <div class="youTuberModal">
            <div id="youtuberClose">&#215;</div>
            <div id="youtuberContainer"></div>
        </div>
  `);

        ytModal();
    }


    // api

    {
        const API = 'AIzaSyBGikPQeXTXTs6jv9irnzJZS-uxy6W__Ds',
              CLIENT = '981436864174-431paqhth3glf9o6b0p27aj5jhll8cdg.apps.googleusercontent.com';

    // auth
    
        {
            const buttonAuth = document.querySelector('#authorize'),
                  authWrap = document.querySelector('.auth');


            gapi.load("client:auth2", () => {
                gapi.auth2.init({
                    client_id: CLIENT
                });
            });

            function authenticate() {
                return gapi.auth2.getAuthInstance()
                    .signIn({
                        scope: "https://www.googleapis.com/auth/youtube.readonly"
                    })
                    .then( () => console.log("Sign-in successful"))
                    .catch(errAuth);
            }

            function loadClient() {
                gapi.client.setApiKey(API);
                return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
                    .then( () => console.log("GAPI client loaded for API"))
                    .then( () => authWrap.style.display = 'none')
                    .catch(errAuth);
            }

            function errAuth(err) {
                console.error(err);
                authWrap.style.display = 'none';
            }
           
            
            buttonAuth.addEventListener('click', () => {
                authenticate().then(loadClient)
            })

            

        }

        //request

        {
            const gloTube = document.querySelector('.logo-academy'),
                  trends = document.querySelector('#yt_trend'),
                  likes = document.querySelector('#yt_like'),
                  main = document.querySelector('#yt_main'),
                  sub = document.querySelector('#yt_subscriptions'),
                  searchForm = document.querySelector('.search-form'),
                  nextBtn = document.querySelector('#next_result');

            let currentRequestOptions = {};     


            function subRender(response) {
                console.log('response');
                const ytWrapper = document.querySelector('#yt-wrapper');
                ytWrapper.textContent = '';
                response.items.forEach(item => {
                    try {
                        const {snippet:{resourceId:{channelId}, description, title, thumbnails:{high:{url}}}} = item;
                            ytWrapper.innerHTML += `
                                <div class="yt" data-youtuber="${channelId}">
                                    <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                                        <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                                </div>
                                <div class="yt-title">${title}</div>
                                    <div class="yt-channel">${description}</div>
                                </div>
                        `;
                    } catch (err) {
                        console.error(err);
                        
                    }

                    
                    
                })

                ytWrapper.querySelectorAll('.yt').forEach(item => {
                    item.addEventListener('click', () => {
                        request({
                            method: 'search',
                            part: 'snippet',
                            channelId: item.dataset.youtuber,
                            order: 'date',
                            maxResults: 6
                        });
                    })
                })
                
                




              
            }      
            



            function render(response) {
                console.log(response);
                const ytWrapper = document.querySelector('#yt-wrapper');
                ytWrapper.textContent = '';
                
                response.items.forEach(item => {
                    try {
                        const {id, id:{videoId}, snippet:{channelTitle, title, resourceId:{videoId:lvId} = {}, thumbnails:{high:{url}}}} = item;
                            ytWrapper.innerHTML += `
                                <div class="yt" data-youtuber="${lvId || videoId || id}">
                                    <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                                        <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                                </div>
                                <div class="yt-title">${title}</div>
                                    <div class="yt-channel">${channelTitle}</div>
                                </div>
                        `;
                    } catch (err) {
                        console.error(err);
                        
                    }

                    
                    
                })
                ytModal();
            }


            function request(options) {
                gapi.client.youtube[options.method]
                .list(options)
                .then(response => response.result)
                .then(data => {
                    options.method === 'subscriptions' ? subRender(data) : render(data);
                    return data.nextPageToken;
                } )
                .then(nxtPage => nextPage(options, nxtPage))
                .catch(err => console.error('error ' + err))
                
            }

            function nextPage(options, page) {
                nextBtn.style.display = 'block';
                currentRequestOptions = options;
                currentRequestOptions.pageToken = page;
                console.log(currentRequestOptions);
                

                
                
            }


            gloTube.addEventListener('click', () => {
                const active = document.querySelector('.active');
                active.classList.remove('active');

                request({
                    method: 'search',
                    part: 'snippet',
                    channelId: 'UCVswRUcKC-M35RzgPRv8qUg',
                    order: 'date',
                    maxResults: 6
                });

                
                
            })

            trends.addEventListener('click', () => {
                request({
                    method: 'videos',
                    part: 'snippet',
                    chart: 'mostPopular',
                    maxResults: 6,
                    regionCode: 'RU',
                });
            })


            likes.addEventListener('click', () => {
                request({
                    method: 'playlistItems',
                    part: 'snippet',
                    playlistId: 'LLpCuibK3ouVA1csKReGTmsQ',
                    maxResults: 6,
                });
            })

            main.addEventListener('click', () => {
                request({
                    method: 'search',
                    part: 'snippet',
                    channelId: 'UCpCuibK3ouVA1csKReGTmsQ',
                    order: 'date',
                    maxResults: 6,
                });
            })


            sub.addEventListener('click', () => {
                request({
                    method: 'subscriptions',
                    part: 'snippet',
                    mine: true,
                    maxResults: 6,
                });
            })
            

            searchForm.addEventListener('submit', e => {
                e.preventDefault();
                const value = searchForm.elements[0].value;
                if (!value) return;
                
                request({
                    method: 'search',
                    part: 'snippet',
                    order: 'relevance',
                    maxResults: 6,
                    q: value,
                });
                
            })


            nextBtn.addEventListener('click' , () => {
                request(currentRequestOptions);
            })
            




        }

    



    }





})
