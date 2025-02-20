import Button from "../components/Button.tsx";
import { useEffect, useState } from "preact/hooks";

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

        const project_name = (document.getElementById("project-name") as HTMLInputElement).value;
        const project_desc = (document.getElementById("project-desc") as HTMLInputElement).value;
        const project_link = (document.getElementById("project-link") as HTMLInputElement).value;
        const project_zt_link = (document.getElementById("project-zt-link") as HTMLInputElement).value;
        const contact_email = (document.getElementById("contact-email") as HTMLInputElement).value;
        const selected_sources_str = selected_sources.join(",");

        fetch(`/api/order_media_mention?project_name=${project_name}&project_desc=${project_desc}&project_link=${project_link}&project_zt_link=${project_zt_link}&contact_email=${contact_email}&selected_sources=${selected_sources_str}`)
        .then(response => response.json())
        .then(data => {
            if (data.success)
            {
                console.log(data);
                window.location.href = `/order/${data.order.id}`;
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
                    <label for="contact-email">Kontakt e-mail</label>
                    <input type="text" id="contact-email" name="contact-email" class="input w-full" placeholder="wasz.email@gmail.com"/>
                    <p class="text-xs text-red-400 mb-2" id="contact-email-error"></p>
                </div>
            </div>

            <div class="panel mt-12">
                <h2 class="mt-4 mb-2">Jak chcecie, by o was <span class="text-pink">wspomniano</span>?</h2>
                <p class="text-gray text-justify">Wybierzcie źródła wzmianek medialnych.</p>
                <div class="form-group mt-6">
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="zt_hype_blog_projects_review" type="checkbox"/>
                        <label for="zt_hype_blog_projects_review">ZTHype blog - Przegląd projektów społecznych zwolnionych.<span><i class="fa-solid fa-check"></i></span></label>
                    </div>
                    <div class="checkbox-box source" style="text-align: left;">
                        <input onClick={update_selected_sources} id="zt_hype_blog_personalized_article" type="checkbox"/>
                        <label for="zt_hype_blog_personalized_article">ZTHype blog - Napiszemy artykuł o waszym projekcie.<span><i class="fa-solid fa-check"></i></span></label>
                    </div>
                </div>

                <p class="text-xs text-red-400 my-4" id="order-error">{error}</p>

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