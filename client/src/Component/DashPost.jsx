import { Table, TableCell } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPost] = useState([])
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getpost?userId=${currentUser._id}`)
        const data = await res.json();
        if (res.ok) {
          setUserPost(data)
        }
        console.log(data)
      } catch (error) {

        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchPost();
    }

  }, [currentUser._id])

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && userPost.length > 0 ? (
          <div>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date updates</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {
                userPost.map((post) => {
                  <Table.Body className='divide-y'>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <TableCell>{new Date(post.updateAt).toLocaleDateString}</TableCell>
                      <TableCell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className='w-20 h-20 object-cover bg-gray-500' />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>{post.title}</Link>
                      </TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>
                        <span className='font-medium text-red-500 hover:underline cursor-pointer'>
                          Delete
                        </span>
                      </TableCell>
                      <tableCell>
                        <Link className='text-teal-500' to={`/update-post/${post._id}`}>
                          <span>
                            Edit
                          </span>
                        </Link>
                      </tableCell>
                    </Table.Row>
                  </Table.Body>
                })
              }




            </Table>
          </div>
        ) : (
          <div>
            <h1>You have no post yet!</h1>

          </div>
        )
      }
    </div>
  )
}

export default DashPost