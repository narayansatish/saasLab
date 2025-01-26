import React, { useEffect, useMemo, useState } from 'react'
import './ProjectTable.css';
const ProjectTable = () => {
    const [projectList,setProjectList]=useState([]);
    const [currentPage,setCurrentPage]=useState(null);
    const [pageNumberList ,setPageNumberList]=useState([])
    const perPage=5;
    const activePage={backgroundColor :"aqua"}
    useEffect(()=>{
        fetch("https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json").then((response)=>{
            return response.json()
        }).then((data)=>{
            setProjectList(data);
            let totalPageNumber=parseInt(data.length/perPage);
            if(totalPageNumber>=3){
                setPageNumberList([1,2,3])
            }
            else{
                let temp=[];
                for(let index=1;index<totalPageNumber;index++){
                    temp.push(index);
                }
                setPageNumberList(temp);
            }
            
            setCurrentPage(0);
        })
    },[]);
    let calculatePaginatedList=()=>{
        let start = currentPage*perPage;
        let end=start+perPage;
        return projectList.slice(start,end)
    }
    const pageList=[];
    const goToNext=()=>{
        if(!pageNumberList.includes(currentPage+2)){
        let temp=[...pageNumberList];
        temp.splice(0,1);
        temp.push(currentPage+2);
        setPageNumberList(temp)
        }
        setCurrentPage(currentPage+1)
    }
    const goToPrevious=()=>{
        if(!pageNumberList.includes(currentPage)){
            let temp=[...pageNumberList];
            temp.splice(temp.length-1,1);
            temp.unshift(temp[0]-1);
            setPageNumberList(temp)
            }
        setCurrentPage(currentPage-1)
    }
    const paginatedList=useMemo(()=>{
        return calculatePaginatedList()
    },[currentPage])
  return (
   <>
   <table>
    <thead>
        <tr>
            <td>S.No</td>
            <td>Percentage funded</td>
            <td>Amount pledged</td>
        </tr>
    </thead>
    <tbody>
        {paginatedList.length!=0 && paginatedList.map((project)=>{
          return   <tr key={project["s.no"]}>
                <td>{project["s.no"]}</td>
                <td>{project["percentage.funded"]}</td>
                <td>{project["amt.pledged"]}</td>
            </tr>
        })}
    </tbody>

   </table>
  
   {projectList.length!==0 && <div style={{display:'flex',flexDirection:'row'}}>
   <span style={{padding:"5px"}}>Total Page : {parseInt(projectList.length/perPage)+(projectList%perPage ? 0 : 1)}</span>
        <button onClick={goToPrevious} disabled={currentPage==0}>Previous
        </button>
        {pageNumberList.length && pageNumberList.map((number)=>{
            return <button onClick={()=>{
                setCurrentPage(number-1)
            }} className={currentPage === number - 1 ? 'active' : ''}>{number}</button>
        })}
       
        <button onClick={goToNext} disabled={currentPage*perPage+perPage>=projectList.length}>Next
        </button>
   </div>}
   </>
  )
}

export default ProjectTable