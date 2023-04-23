let pages;
let page_fault;

function check_ref(){
    let ref = document.getElementById("page-sequence").value;

    if(ref != 0){
        pages = ref.split(",");
        for(let i = 0; i<pages.length; i++){
            pages[i] = pages[i].trim();
        }
    
        // for(let i = 0; i<pages.length; i++){
        //     if(pages[i] == 0){
        //         pages.splice(i,1);
        //         i--;
        //     }
        // }
    }
}

function page_exist(frames, index, page, arr){
    let flag = false;

    for(let i = 0; i<frames; i++){
        if(arr[i][index] == page){
            flag = true;
            return flag;
        }
    }

    return flag;
}

function find_page(i,frames,arr){
    let index = i;
    let count = 0;
    let page_found = {};

    for(let j = 0 ; j<frames; j++){
        page_found[arr[j][i]] = false;
    }

    while(count != frames-1){
        let page = pages[index];
        for(let j = 0; j<frames; j++){
            if(page == arr[j][i]){
                page_found[page] = true;
                count++;
                break;
            }
        } 
        index--;
    }

    for(j = 0; j<frames; j++){
        if(page_found[arr[j][i]] == false){
            return j;
        }
    }
}

function add_css(cell){
    cell.style.backgroundColor="white";
    cell.style.border="1px solid black";
    cell.style.padding="6px";
    cell.style.width="30px";
}

function calculate(){
    document.getElementById("start-message").innerHTML="Page Replacement Matrix";
    let page_faults = 0;

    let len = pages.length;
    for(let i = 0; i < pages.length; i++){
        pages[i] = parseInt(pages[i]);
    }
    console.log(pages);

    let frames = parseInt(document.getElementById("frames").value);
    console.log(frames);

    let arr = new Array(frames);
    for(let i = 0; i<frames; i++){
        arr[i] = new Array(len);
    }

    for(let i = 0;i<frames; i++){
        for(let j = 0; j < len; j++){
            arr[i][j] = -1;
        }
    }
    console.table(arr);

    let index = 0; 
    let fno = 0;
    page_fault = new Array(len);

    while(fno != frames){
        if(index == 0){
            arr[fno][index] = pages[index];
            page_fault[index] = true;
            fno++;
            page_faults++;
        }
        else{
            for(let j = 0; j<frames; j++){
                arr[j][index] = arr[j][index-1];
            }

            if(!page_exist(frames, index-1, pages[index], arr)){
                arr[fno][index] = pages[index];
                page_fault[index] = true;
                fno++;
                page_faults++;
            }else{
                page_fault[index] = false;
            }
        } 
        index++;
    }

    // console.table(arr);

    // console.log(page_faults);

    for(let i = index; i<len; i++){
        let page = pages[i];

        if(!(page_exist(frames, i-1, page, arr))){
            page_faults++;
            let remove_page = find_page(i-1, frames,arr); 
            for(let j = 0; j<frames; j++){
                arr[j][i] = arr[j][i-1];
            }
            page_fault[i] = true;
            arr[remove_page][i] = page;
        }else{
            for(let j = 0; j<frames; j++){
                arr[j][i] = arr[j][i-1];
            }
            page_fault[i] = false;
        }
    }

    console.log(arr);
    console.log(page_fault);
    console.log(page_faults);

    var ans_table = document.getElementById('process-table').getElementsByTagName('tbody')[0];
    var header = ans_table.insertRow(ans_table.length);
    var cell1 = header.insertCell(0);
    cell1.style.width="30px";

    for(let i = 1; i<len+1; i++){
        var cell = header.insertCell(i);
        add_css(cell);
        cell.style.backgroundColor="lightgray";
        cell.innerHTML = pages[i-1];
    }

    for(let i = 0; i<frames; i++){
        var row = ans_table.insertRow(ans_table.length);
        var cell = row.insertCell(0);
        cell.innerHTML = "f" + String(i+1);

        for(let j = 0; j<len; j++){ 
            cell = row.insertCell(j+1);
            add_css(cell);
            if(arr[i][j] == -1)
            cell.innerHTML = " ";
            else
            cell.innerHTML = arr[i][j];
        }
    }

    var row = ans_table.insertRow(ans_table.length);
    var cell = row.insertCell(0);
    cell.innerHTML = "Page Hits";
    for(let i = 0; i<len; i++){
        cell = row.insertCell(i+1);
        if(page_fault[i]){
            cell.innerHTML = "&#10060";
        }else{
            cell.innerHTML = "&check;"
            cell.style.color = "#38b000";
        }
        add_css(cell);
    }

    document.getElementById("NoOfPF").innerHTML = "No. of Page Faults : " + String(page_faults);
    document.getElementById("PageHit").innerHTML = "No. of Page Hits : " + String(len-page_faults);
    var hitRatio = (((len-page_faults)/len)*100).toPrecision(3);
    document.getElementById("HitRatio").innerHTML = "Page Hit Ratio : " + String(hitRatio) + "%";
    var MissRatio = ((page_faults/len)*100).toPrecision(3);
    document.getElementById("MissRatio").innerHTML = "Page Miss Ratio : " + String(MissRatio) + "%";

    document.getElementById("addp").disabled = true;
}