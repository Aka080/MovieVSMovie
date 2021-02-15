const createAutocomplete =({root,renderOption,onOptionSelect,inputValue,fetchData})=>{
    root.innerHTML=`
    <label><b>Search</b></label>
    <input type="text" class="input">
      <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
      </div>
    `;
    const input = root.querySelector('input');
    const dropdown= root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async (e)=>{
        const items = await fetchData(e.target.value);
        if(!items.length){
            dropdown.classList.remove('is-active');
            return;
        }
        resultsWrapper.innerHTML='';//clear old list on every new entery
        dropdown.classList.add('is-active')
        for(let item of items){
            
            const option = document.createElement('a');
            option.classList.add('dropdown-item')
            option.innerHTML=renderOption(item);
            option.addEventListener('click',()=>{//for every single link to item
                input.value = inputValue(item);
                dropdown.classList.remove('is-active');
                onOptionSelect(item);//fetch item details 
            })
            resultsWrapper.appendChild(option);
        } 
    }
    input.addEventListener('input',debounce(onInput,500));
    
}

