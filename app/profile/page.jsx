'use client';

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import Loading from "@components/layout";


const MyProfile = () => {
    const router = useRouter();
    const {data: session} = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
          const response = await fetch(`api/users/${session?.user.id}/posts`);
          const data = await response.json();
          setPosts(data);
          setLoading(false);
        }
    
       if(session?.user.id) {fetchPosts()} ;
      }, []);


      const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`)
      }
      
      const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

        if(hasConfirmed){
            try{
                await fetch(`/api/prompt/${post._id.toString()}`,
            {
                method: 'DELETE'
            });

            const filteredPost = posts.filter((p) => p._id !== post._id);
            setPosts(filteredPost);
            }catch(error){
                console.log(error)
            }
        }
      }
      if (loading) {
        return <Loading/>
      }
  return (
   <Profile
      name="My"
      desc="Thank you for sharing your creative prompts!!"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete} />
  )
}

export default MyProfile