import React,{useEffect} from 'react'
import {  useNavigate,Link,useParams } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import {Table,Button} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {listAllNews,deleteNews,reset1   } from '../features/news/newsSlice.js'


const NewsPubliesListScreen = () => {

    function formaterDate(str){
        return  str.substring(0,16).replace('T',' à ')
        }
    
const params=useParams()
    const dispatch=useDispatch()
    const user=useSelector(state=>state.user)
    const {userLogin}=user
       
    const news=useSelector(state=>state.news)
    const {allnewsLoading,allnewsError,allnewsMessageError,allnews}=news.allnewsInfo

   
    const newsPubliés=allnews.filter((n)=>n.publié)


    const {Loadingdelete,Errordelete,Successdelete,messagedelete}=news.deleteNewsInfo
    
    const navigate=useNavigate()
    useEffect(()=>{ 
       
        if(userLogin && userLogin.isAdmin ){
           dispatch(reset1())
        dispatch(listAllNews())
        }

        else{
            navigate('/login')
        }
    },[dispatch,navigate,userLogin ,Successdelete])

    
    const deleteHndler=(id)=>{
        if(window.confirm('Vous voulez supprimer ce News')){
           
        dispatch(deleteNews(id))
    }
    }


  return (
    <div> 
           <Link to='/' className='btn btn-light my-3'>Revenir</Link>
        {newsPubliés.length === 0 ? <h1>Pas de News</h1> : (
            <>
  <h1>News qui sont Publiés</h1>
  {Errordelete && <Message variant='danger'>{messagedelete}</Message>}
  {allnewsLoading ? <Loader/> : allnewsError ? <Message variant='danger'>{allnewsMessageError}</Message> : (
      <Table striped bordered="true" hover responsive className='table-sm'>
          <thead>
              <tr>
                  <th style={{width:'500px'}}>TITRE</th>
                  <th>AUTEUR</th>
                  <th>DATE</th>
                  <th>CATEGORY</th>
                  <th>VIDEO</th>
                  <th></th>
              </tr>
          </thead>
          <tbody>
              {newsPubliés.map((news)=>(
                  <tr key={news._id}>
                       <td style={{width:'500px'}}>{news.titre}</td>
                      <td>{news.auteur && news.auteur.nom}</td>
                      <td>{formaterDate(news.createdAt.substring(0,16))}</td>
                      <td>{news.category}</td>
                      <td>
                          {news.isVideo ?   <i className='fas fa-check' style={{color:'green'}}></i>:(
                              <i className='fas fa-times' style={{color:'red'}}></i>
                          )}
                      </td>
                      <td >
                          <LinkContainer to={`/admin/news/modifier/${news._id}`}>
                          <Button variant='primary' className='btn-sm mx-2 mt-1'>
                                  <i className='fas fa-edit' style={{color:'green'}}></i>
                              </Button>
                          </LinkContainer>
                          <Button variant='danger'  className='btn-sm mx-2 mt-1' onClick={()=>deleteHndler(news._id)}>
                          <i className='fas fa-trash'  style={{color:'red'}}></i>
                          </Button>
                      </td>
                  </tr>
              ))}
          </tbody>
      </Table>
  )}
      </>  )} 
      
    </div>
  )
}

export default NewsPubliesListScreen