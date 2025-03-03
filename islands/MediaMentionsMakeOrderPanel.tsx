import Button from "../components/Button.tsx";
import { useEffect, useState } from "preact/hooks";
import { add_saved_order } from "../utils/saved_orders.ts";

function get_source_count_string(count: number)
{
    if (count == 1) return "1 źródło";
    if (count >= 2 && count <= 4) return `${count} źródła`;
    return `${count} źródeł`;
}

export function MediaMentionsMakeOrderPanel()
{
    const [selected_sources, set_selected_sources] = useState<string[]>([]);
    const [error, set_error] = useState<string>("");
    const [loading, set_loading] = useState<boolean>(false);
    
    function update_selected_sources()
    {
        console.log("update_selected_sources");
        const sources: string[] = [];
        const checkboxes = document.querySelectorAll('.source input');
        console.log(checkboxes);
        checkboxes.forEach((checkbox) => {
            console.log(checkbox);
            if ((checkbox as HTMLInputElement).checked) {
                sources.push(checkbox.id);
            }
        });
        console.log(sources);
        set_selected_sources(sources);
    }

    function make_order()
    {
        set_loading(true);

        let project_name = (document.getElementById("project-name") as HTMLInputElement).value;
        let project_desc = (document.getElementById("project-desc") as HTMLInputElement).value;
        let project_link = (document.getElementById("project-link") as HTMLInputElement).value;
        let project_zt_link = (document.getElementById("project-zt-link") as HTMLInputElement).value;
        let contact_email = (document.getElementById("contact-email") as HTMLInputElement).value;
        let selected_sources_str = selected_sources.join(",");

        if (project_name.length == 0) {
            set_error("Podaj nazwę projektu.");
            set_loading(false);
            return;
        }

        if (project_desc.split(" ").length < 60) {
            console.log(project_desc.split(" "));
            set_error("Opis projektu musi mieć co najmiej 60 słów. (Obecnie: " + (project_desc.length > 0 ? project_desc.split(" ").length : 0) + " słów)");
            set_loading(false);
            return;
        }

        if (project_link.length == 0 || !project_link.startsWith("http") || !project_link.includes(".")) {
            set_error("Podaj prawidłowy link do social mediów projektu.");
            set_loading(false);
            return;
        }

        if (project_zt_link.length == 0 || !project_zt_link.startsWith("https://zwolnienizteorii.pl/a/#/app/project-details/")) {
            set_error("Podaj prawidłowy link do waszego projektu na platformie Zwolnionych z Teorii.");
            set_loading(false);
            return;
        }

        if (contact_email.length == 0 || !contact_email.includes("@") || !contact_email.includes(".")) {
            set_error("Podaj prawidłowy email do kontaktu.");
            set_loading(false);
            return;
        }

        if (selected_sources.length == 0) {
            set_error("Wybierz co najmniej jedno źródło wzmianki medialnej.");
            set_loading(false);
            return;
        }

        project_name = encodeURIComponent(project_name);
        project_desc = encodeURIComponent(project_desc);
        project_link = encodeURIComponent(project_link);
        project_zt_link = encodeURIComponent(project_zt_link);
        contact_email = encodeURIComponent(contact_email);
        selected_sources_str = encodeURIComponent(selected_sources_str);

        fetch(`/api/order_media_mention?project_name=${project_name}&project_desc=${project_desc}&project_link=${project_link}&project_zt_link=${project_zt_link}&contact_email=${contact_email}&selected_sources=${selected_sources_str}`)
        .then(response => response.json())
        .then(data => {
            if (data.success)
            {
                console.log(data);

                add_saved_order(data.order);

                window.location.href = `/orders/${data.order.id}`;
            }
            else
            {
                set_error(data.error);
                set_loading(false);
            }
        })
    }

    return (
        <>
            <div class="panel mt-12">
                <h2 class="my-4">Opowiedzcie nam o <span class="text-pink">sobie</span>.</h2>
                
                <div class="form-group">
                    <label for="project-name">Nazwa projektu</label>
                    <input type="text" id="project-name" name="project-name" class="input w-full" placeholder="Nasz Super Projekt"/>
                </div>

                <div class="form-group">
                    <label for="project-desc">Opis projektu</label>
                    <textarea type="text" id="project-desc" name="project-desc" class="input w-full" placeholder="Jesteśmy grupą..."/>
                </div>

                <div class="form-group">
                    <label for="project-link">Link do waszych social mediów / strony internetowej</label>
                    <input type="text" id="project-link" name="project-link" class="input w-full" placeholder="https://www.instagram.com/super_projekt/"/>
                </div>

                <div class="form-group">
                    <label for="project-zt-link">Link do projektu Zwolnionych z Teorii, z bazy projektów</label>
                    <input type="text" id="project-zt-link" name="project-zt-link" class="input w-full" placeholder="https://zwolnienizteorii.pl/a/#/app/project-details/xxxxxxx"/>
                </div>

                <div class="form-group">
                    <label for="contact-email">Kontakt e-mail</label>
                    <input type="text" id="contact-email" name="contact-email" class="input w-full" placeholder="wasz.email@gmail.com"/>
                </div>
            </div>

            <div class="panel mt-12">
                <h2 class="mt-4 mb-2">Jak chcecie, by o was <span class="text-pink">wspomniano</span>?</h2>
                <p class="text-gray text-justify">Wybierzcie źródła wzmianek medialnych.</p>
                <div class="form-group mt-6">
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="zt_hype_blog_projects_review" type="checkbox"/>
                        <label for="zt_hype_blog_projects_review"><span><i class="fa-solid fa-check"></i></span>ZTHype blog - Przegląd projektów społecznych zwolnionych.</label>
                    </div>
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="zt_hype_blog_personalized_article" type="checkbox"/>
                        <label for="zt_hype_blog_personalized_article"><span><i class="fa-solid fa-check"></i></span>ZTHype blog - Napiszemy artykuł o waszym projekcie.</label>
                    </div>

                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="bobrlog_personalized_article" type="checkbox"/>
                        <label for="bobrlog_personalized_article"><span><i class="fa-solid fa-check"></i></span>BobrLog - Wspomnimy o waszym projekcie w artykule napisanym dla was.</label>
                    </div>
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="bobrlog_compilation" type="checkbox"/>
                        <label for="bobrlog_compilation"><span><i class="fa-solid fa-check"></i></span>BobrLog - Dodamy was do naszej kompilacji najlepszych projektów ZwzT.</label>
                    </div>

                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="literno_personalized_article" type="checkbox"/>
                        <label for="literno_personalized_article"><span><i class="fa-solid fa-check"></i></span>Literno - Wspomnimy o was na naszym blogu.</label>
                    </div>
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="literno_compilation" type="checkbox"/>
                        <label for="literno_compilation"><span><i class="fa-solid fa-check"></i></span>Literno - Dodamy was do naszego przedstawienia kilku projektów ZwzT.</label>
                    </div>

                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="actopira_personalized_article" type="checkbox"/>
                        <label for="actopira_personalized_article"><span><i class="fa-solid fa-check"></i></span>Actopira - Będzie wpis o was na naszej stronie www</label>
                    </div>
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="actopira_compilation" type="checkbox"/>
                        <label for="actopira_compilation"><span><i class="fa-solid fa-check"></i></span>Actopira - Umieścimy wasz projekt na liście projektów na naszej stronie</label>
                    </div>

                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="qulia_personalized_article" type="checkbox"/>
                        <label for="qulia_personalized_article"><span><i class="fa-solid fa-check"></i></span>Qulia - Wyreadagujemy artykuł specjalnie dla was.</label>
                    </div>
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="qulia_compilation" type="checkbox"/>
                        <label for="qulia_compilation"><span><i class="fa-solid fa-check"></i></span>Qulia - Wspomnimy o was przy okazji tworzenia listy projektów ze zwolnionych.</label>
                    </div>
                    
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="socjovibe_personalized_article" type="checkbox"/>
                        <label for="socjovibe_personalized_article"><span><i class="fa-solid fa-check"></i></span>Socjovibe - Napiszemy o was wpis.</label>
                    </div>
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="socjovibe_compilation" type="checkbox"/>
                        <label for="socjovibe_compilation"><span><i class="fa-solid fa-check"></i></span>Socjovibe - Dodamy was do najnowszej kompilacji projektów.</label>
                    </div>
                </div>

                { error != "" &&
                    <p class="text-sm text-red-300 my-4" id="order-error"><i class="fa-solid fa-triangle-exclamation mr-2"></i>{error}</p>
                }

                {
                    loading ?
                    <Button text={`Składanie zamówienia...`} className="my-4" fa_icon="spinner" border={true} full={true} iconClassName="animate-spin"/>
                    :
                    <Button text={`Złóż zamówienie (${get_source_count_string(selected_sources.length)})`} onClick={make_order} className="my-4" fa_icon="truck-fast" border={true} disabled={selected_sources.length == 0} full={true}/>
                }
                
            </div>
        </>
    )
}