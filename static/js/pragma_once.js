function remove_all_repeated_pragma_once_elements()
{
    let elements = document.getElementsByClassName("pragma-once");
    let pragma_groups = []

    for (let i = 0; i < elements.length; i++)
    {
        let element = elements[i];
        let pragma_name = element.getAttribute("pragma-name");

        if (pragma_name == null) {
            element.remove()
            continue;
        }

        for (let j = 0; j < pragma_groups.length; j++) {
            if (pragma_groups[j].name == pragma_name) {
                let old_element_pragma_force = parseInt(pragma_groups[j].element.getAttribute("pragma-force")) | 0;
                let new_element_pragma_force = parseInt(element.getAttribute("pragma-force") | 0);

                if (old_element_pragma_force >= new_element_pragma_force) {
                    print("Removing", new_element_pragma_force, "because", old_element_pragma_force, "is already present.")
                    new_element_pragma_force.remove()
                    return
                }

                print("Removing", old_element_pragma_force, "because", new_element_pragma_force, "is already present.")
                old_element_pragma_force.remove()
                return
            }
        }

        pragma_groups.push({"name" : pragma_name, "element": element});
    }
}

setInterval(remove_all_repeated_pragma_once_elements, 100);