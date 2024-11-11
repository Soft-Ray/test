document.addEventListener("DOMContentLoaded", function() {
    let text = "안녕하세요, 여행자님!\n폴더 속 작은 우주 영웅들의 이야기가 여러분을 기다리고 있습니다.\n그들과 함께하세요.";
    let typedText = document.getElementById("typed-text");
    let image = document.getElementById("image");
    let i = 0;

    // 타이핑 음악과 줄바꿈 음악 파일 설정
    let typingAudio = new Audio('typing.mp3');       // 기본 타이핑 음악
    let enterAudio = new Audio('enter.mp3');         // 줄바꿈 시 재생되는 음악
    let imageAudio = new Audio('image.mp3');         // 이미지 나타날 때 재생되는 음악
    let loadingAudio = new Audio('loading.mp3');     // 로딩 화면 음악
    let offAudio = new Audio('off.mp3');             // 로딩 후 종료 음악

    typingAudio.loop = true;

    // 줄바꿈 소리의 음량을 0.2로 설정 (기본 볼륨보다 작게 설정)
    typingAudio.volume = 0.8;
    enterAudio.volume = 0.2;
    loadingAudio.volume = 0.7;
    offAudio.volume = 0.6;

    let hasInteracted = false; // 사용자가 상호작용했는지 여부

    // 사용자 상호작용 이벤트 (클릭 등) 추가
    document.body.addEventListener("click", function() {
        if (!hasInteracted) {
            hasInteracted = true;
            typingAudio.play(); // 클릭 시 타이핑 음악 재생
            typeWriter(); // 클릭 후 텍스트 타이핑 시작
        }
    });

    function typeWriter() {
        if (hasInteracted) {
            // 타이핑이 시작되면 기본 타이핑 음악 재생
            if (i === 0) {
                typingAudio.play();
            }

            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    // 줄바꿈 시 타이핑 음악을 일시 정지하고 줄바꿈 음악을 재생
                    typingAudio.pause();
                    enterAudio.currentTime = 0;          // 줄바꿈 음악 재생 시작 위치 초기화
                    enterAudio.play();

                    // 줄바꿈 효과 후 다시 타이핑 음악 재생
                    setTimeout(() => {
                        typingAudio.play();
                    }, 500);  // 줄바꿈 음악이 재생되는 동안 지연 시간 추가

                    typedText.innerHTML += '<br>';
                } else {
                    typedText.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(typeWriter, 80);
            } else {
                // 타이핑이 모두 끝나면 타이핑 음악을 멈춤
                typingAudio.pause();
                setTimeout(() => {
                    typedText.classList.add("fade-out");
                    setTimeout(() => {
                        typedText.style.display = "none";
                        image.classList.add("fade-in");
                        image.style.display = "block";
                        imageAudio.play(); // 이미지가 나타날 때 음악 재생
                    }, 1000);
                }, 1000);
            }
        }
    }

    // 로딩 텍스트가 표시될 때 실행되는 함수
    function showLoadingText() {
        let loadingTextContent = "Loading...\n잠시만 기다려주세요..."; // 로딩 텍스트 내용
        let j = 0; // 텍스트 인덱스

        // 로딩 화면 표시
        document.getElementById("loading").style.display = 'flex';

        // 로딩 음악 재생
        console.log("로딩 음악 재생 시작");  // 로딩 음악 재생 시작 확인
        loadingAudio.play().catch(error => {
            console.error("로딩 음악 재생 실패:", error);  // 음악 재생 오류 확인
        });

        // 로딩 텍스트 타이핑
        function typeLoading() {
            if (j < loadingTextContent.length) {
                // 텍스트가 중복되지 않도록, 한 글자씩 추가
                document.getElementById("loading-text").innerHTML += loadingTextContent.charAt(j);
                j++;
                setTimeout(typeLoading, 200); // 타이핑 속도 조정 (200ms)
            } else {
                // 로딩 텍스트 타이핑이 끝난 후 5초 대기
                setTimeout(() => {
                    loadingAudio.pause(); // 로딩 음악 멈춤
                    offAudio.play(); // off.mp3 음악 재생

                    // off.mp3가 끝난 후 페이지 이동
                    offAudio.onended = function() {
                        window.location.href = document.getElementById("image-link").href; // 지정된 링크로 이동
                    };
                }, 3000); // 5초 대기 후 off.mp3 재생
            }
        }
        typeLoading(); // 로딩 텍스트 타이핑 시작
    }

    // 클릭 시 로딩 화면 표시
    document.getElementById("image-link").addEventListener("click", function(event) {
        event.preventDefault(); // 기본 링크 클릭 동작 방지
        showLoadingText(); // 로딩 텍스트 타이핑 시작
    });
});
