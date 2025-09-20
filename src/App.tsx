import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers, AddTodo, Delete, EditUser, fetchUsersById, DeleteImage,AddImage } from './reduser/counterSlice'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './components/ui/button'
import { useFormik } from 'formik';

export function App() {
  const { users, usersID } = useSelector((state) => state.counter)
  const dispatch = useDispatch()
  const [file, setFile] = useState("")
  const [file2, setFile2] = useState("")
  const [idx, setIdx] = useState("")
  const [search, serSearch] = useState("")
  useEffect(() => {
    dispatch(fetchUsers(), fetchUsersById())
  }, [])
  const Addformik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    onSubmit: values => {
      console.log(values);
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      dispatch(AddTodo(formData));
    },
  });
  const Editformik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    onSubmit: values => {
      let newUser = {
        name: values.name,
        description: values.description,
        id: idx
      }
      dispatch(EditUser(newUser))
    },
  });

  function handleEdit(e) {
    setIdx(e.id)
  }

  function handleimage(e) {
    const fileName = e.target.files[0];
    Addformik.setFieldValue("images", fileName);

    const reader = new FileReader();
    reader.readAsDataURL(fileName);
    reader.onload = () => {
      setFile(reader.result);
    };
  }

  function Addhandleimage(e) {
    const fileName = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileName);
    reader.onload = () => {
      setFile2(reader.result);
    };
    AddImage(reader)
  }
  return (
    <div>
      <br /><br />
      <div className='flex gap-[20px] items-center'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className='ml-[20px]'>Add</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={Addformik.handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input
                    name="name"
                    type="text"
                    onChange={Addformik.handleChange}
                    value={Addformik.values.name} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Username</Label>
                  <Input
                    name='description'
                    type="text"
                    onChange={Addformik.handleChange}
                    value={Addformik.values.description} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name-1">File</Label>
                  <Input type='file' onChange={(e) => handleimage(e)} />
                </div>
                <br />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" variant="outline">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Input type='serch' className='w-[200px]' placeholder='Serch...' value={search} onChange={(e) => serSearch(e.target.value)} />
      </div>
      <Table className='mt-[40px] p-[20px]'>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter((e) => e.name.toLowerCase().includes(search.toLowerCase().trim()))
            .map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium flex items-center gap-[10px]">
                  {e.images.map((img) => {
                    return (
                      <img className='w-[30px] rounded-[100%] h-[30px]' key={img.id} src={`http://37.27.29.18:8001/images/${img.imageName}`} />
                    )
                  })}
                  {
                    e.name
                  }
                </TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>{e.status ? "Active" : "InActive"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" onClick={() => dispatch(Delete(e.id))}>Delete</Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className='ml-[20px]' onClick={() => handleEdit(e)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you&apos;re
                          done.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={Editformik.handleSubmit}>
                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input
                              name="name"
                              type="text"
                              onChange={Editformik.handleChange}
                              value={Editformik.values.name} />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="username-1">Username</Label>
                            <Input
                              name='description'
                              type="text"
                              onChange={Editformik.handleChange}
                              value={Editformik.values.description} />
                          </div>
                          <br />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" variant="outline">Save</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className='ml-[20px]' onClick={() => dispatch(fetchUsersById(e.id))}>Info</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Info</DialogTitle>
                        <DialogDescription>

                          <div>
                            {usersID.images?.map((imgId: any) => {
                              return (
                                <div key={imgId}>
                                  <img key={imgId.id} src={`http://37.27.29.18:8001/images/${imgId.imageName}`} alt="" className='rounded-[20px]' />
                                  <Button variant="ghost" onClick={() => dispatch(DeleteImage(imgId.id))}>Del Image</Button>
                                </div>
                              )
                            })
                            }
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">Add Image</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Add Image</DialogTitle>
                                  <DialogDescription>    
                                  </DialogDescription>
                                </DialogHeader>
                                  <div className="grid gap-4">
                                    <div className="grid gap-3">
                                      <Label htmlFor="name-1">File</Label>
                                      <Input type='file' onChange={(e) => Addhandleimage(e)} />
                                    </div>
                                    <br />
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" variant="outline">Save</Button>
                                  </DialogFooter>
                              </DialogContent>
                            </Dialog><br />
                            <br />
                            <h1 className='text-[20px] text-[black]'>Name : {usersID.name}</h1><br />
                            <h1 className='text-[20px] text-[black]'>Desc : {usersID.description}</h1><br />
                            <h1 className='text-[20px] text-[black]'> Status : {usersID.isComplated ? "Active" : "inActive"}</h1>
                          </div>
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="outline">Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Table Users</TableCell>
            <TableCell className="text-right">users {users.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
export default App