import Button from "../components/Button.tsx";
import HomeServiceButton from "../components/HomeServiceButton.tsx";
import TopNav from "../components/TopNav.tsx";

export default function Home() {
    return (
        <>
            <head>
                <title>Zdobądź wzmianki medialne do twojego projektu - ZTHype</title>
            </head>
            <body>
                <TopNav/>
                <div class="panel">
                    <h1 class="my-4">Zdobądź <span class="text-pink">wzmianki medialne</span>.</h1>
                    <p class="text-gray text-justify">
                        Wzmianka medialna na platformie Zwolnionych z Teorii, to wpis na stronie mediów, na stronie blogu lub na stronie popularno naukowej i innych.
                        Współpracujemy z wieloma stronami blogowymi, opierających swoje treści na projektach Zwolnionych z Teorii, a na tej stronie możesz zamówić wpisy dla
                        twojego projektu.
                    </p>

                    <h2 class="my-4 mt-12">Współpracujemy z tymi stronami:</h2>
                    <div class="flex justify-center">
                        <img src="/src/brand/zthype_blog_white_logo_text_color_transparent.png" class="h-16 mr-4 mb-4" />
                    </div>
                </div>

                <div class="panel mt-12">
                    <h2 class="my-4">Opowiedzcie nam o <span class="text-pink">sobie</span>.</h2>
                    
                    <div class="form-group">
                        <label for="project-name">Nazwa projektu</label>
                        <input type="text" id="project-name" name="project-name" class="input w-full" placeholder="Nasz Super Projekt"/>
                        <p class="text-xs text-red-400 mb-2" id="project-name-error"></p>
                    </div>

                    <div class="form-group">
                        <label for="project-desc">Opis projektu</label>
                        <textarea type="text" id="project-desc" name="project-desc" class="input w-full" placeholder="Jesteśmy grupą..."/>
                        <p class="text-xs text-red-400 mb-2" id="project-desc-error"></p>
                    </div>

                    <div class="form-group">
                        <label for="project-link">Link do waszych social mediów / strony internetowej</label>
                        <input type="text" id="project-link" name="project-link" class="input w-full" placeholder="https://www.instagram.com/super_projekt/"/>
                        <p class="text-xs text-red-400 mb-2" id="project-link-error"></p>
                    </div>

                    <div class="form-group">
                        <label for="project-zt-link">Link do projektu Zwolnionych z Teorii, z bazy projektów</label>
                        <input type="text" id="project-zt-link" name="project-zt-link" class="input w-full" placeholder="https://zwolnienizteorii.pl/a/#/app/project-details/xxxxxxx"/>
                        <p class="text-xs text-red-400 mb-2" id="project-zt-link-error"></p>
                    </div>

                    <div class="form-group">
                        <label for="project-name">Kontakt e-mail</label>
                        <input type="text" id="project-name" name="project-name" class="input w-full" placeholder="wasz.email@gmail.com"/>
                        <p class="text-xs text-red-400 mb-2" id="project-name-error"></p>
                    </div>
                </div>

                <div class="panel mt-12">
                    <h2 class="mt-4 mb-2">Jak chcecie, by o was <span class="text-pink">wspomniano</span>?</h2>
                    <p class="text-gray text-justify">Wybierzcie źródła wzmianek medialnych.</p>
                    <div class="form-group mt-6">
                        <div class="checkbox-box" style="text-align: left;">
                            <input id="zt_hype_blog_projects_review" type="checkbox"/>
                            <label for="zt_hype_blog_projects_review">ZTHype blog - Przegląd projektów społecznych zwolnionych.<span><i class="fa-solid fa-check"></i></span></label>
                        </div>
                        <div class="checkbox-box" style="text-align: left;">
                            <input id="zt_hype_blog_personalized_article" type="checkbox"/>
                            <label for="zt_hype_blog_personalized_article">ZTHype blog - Napiszemy artykuł o waszym projekcie.<span><i class="fa-solid fa-check"></i></span></label>
                        </div>
                    </div>

                    <Button text="Złóż zamówienie" className="my-4" fa_icon="truck-fast" full={true}/>
                </div>
            </body>
        </>
    );
}
