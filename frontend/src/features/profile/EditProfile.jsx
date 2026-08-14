
import { useState , useRef , useEffect} from 'react';
import { useParams } from "react-router-dom";
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { 
    Container ,Avatar, Input, Typography, Paper,
     Stack, Box, CardMedia, IconButton, Divider,
      TextField, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
// import {CheckUserName ,UpdateProfile , getUserData} from '../../api/profile'
import api from '../../api/profileApi'
import { Controller, useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';


export default function EditProfile() {

    
    const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: {
        errors,
        isDirty,
        isSubmitting,
        isValid
    }
    } = useForm({

        defaultValues:{
            username:"",
            bio:"",
            name:""
        } ,
        mode: "onBlur"

    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [massage , setMassage] = useState('')
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', username: '', bio: '',image:'' });
    const [profileImage, setProfileImage] = useState(null);
    
    
    const navigate = useNavigate();

    function handleImageChange(e) {
        setProfileImage(e.target.files[0]);
        setForm({...form, ['image']: e.target.files[0]});
    };
    const onSubmit = (data) => {
        console.log("submitted")
        console.log(data)

        const formData = new FormData();

        formData.append("username", data.username);
        formData.append("name", data.name);
        formData.append("bio", data.bio);

        if (data.image?.[0]) {
            formData.append("image", data.image[0]);
        }
        console.log(formData.get('username'))
        api.updateProfile(formData);
    };

    const { username } = useParams();

    useEffect(() => {
    async function loadUser() {
        const user = await api.getProfileData(username);
        console.log(user)
        reset(user);
    }

    loadUser();
    }, [reset, username]);


    const typed_username = useRef('')
    const [isUnique , setIsUnique] = useState(false)
    
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
    
    function HandleUniqueUserName(e) {
        //fetch username then if available true eles flase 
        typed_username.current = e.target.value
        if (api.checkUserName()) {
            setIsUnique(false) ;
            setMassage('Your Username is already Taken')
        }
        else {
            setMassage('');
            setIsUnique(true) ;
        }
    }
    // const handlesubmit = async (e) => {
    //     console.log('submitted')
    //     e.preventDefault();
    //     if (isUnique== false) {
    //         return;
    //     }
    //     else {
    //         const data = new FormData();

    //         Object.entries(form).forEach(([key, value]) => {
    //             if (value !== null) {
    //                 data.append(key, value);
    //             }
    //         });
    //         console.log(`${data}`)
    //         setLoading(true)
    //         try {
    //             await api.updateProfile(data);
    //             setSuccess(true);
    //             } catch (err) {
    //                 setError(err.message);
    //             } finally {
    //             setLoading(false);
    //         }
    //     }
    // }

    
    return <>
        <Container maxWidth="md"  >
            <Paper elevation={2} sx={{
                py:2,
                m:3,
                mt:4
            }}>
                <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)}>
                    {
                        error && (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        )
                    }
                    
                    <Typography variant='h4'>
                        Edit Your Profile
                    </Typography>
                    
                    <Box>
                        <CardMedia src=''>

                        </CardMedia>
            
                        <Button  variant="contained" component="label" >
                            <Input {...register("image")} accept="image/*"  onChange={handleImageChange} hidden type='file' placeholder="Change Image" >
                                
                            </Input>
                            Upload Image
                        </Button>
                    </Box>

                    <Divider></Divider>
                    
                    
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required:"name required",
                            minLength: 3
                        }}
                        render={({ field })=>(
                        
                            <TextField label = "name" 

                                {...field}

                                error={!!errors.name}

                                helperText={errors.name?.message}

                                onChange={(e)=>{

                                    field.onChange(e);

                                    console.log(e.target.value);
                                }}

                            />
                        )}
                    />
                    <Controller
                        name="username"
                        control={control}
                        rules={{
                            required:"username required",
                            minLength: 3
                        }}
                        render={({ field })=>(
                        
                            <TextField label = "username" 

                                {...field}

                                error={!!errors.username}

                                helperText={errors.username?.message}

                                onChange={async (e)=>{
                                    field.onChange(e);
                                    const username = e.target.value;
                                    if(username.length >= 3){

                                        await api.checkUsername(username);
                                }

                            }}

                            />
                        )}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register("email", {
                            required: "Email is required.",
                            maxLength: {
                                value: 254, // Matches Django's EmailField max_length
                                message: "Email must not exceed 254 characters.",
                            },
                            pattern: {
                                // Django-compatible practical email validation
                                // Final validation is still performed by Djoser/Django backend.
                                value:
                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address.",
                            },
                        })}
                    />
        
                    <TextField {...register("bio")} label="Bio" multiline rows={4} value={form.bio} onChange={update('bio')}/> 

                    <Stack direction="row" sx={{
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center"
                        }}>
                        <Button variant="contained" >
                            Cancel
                        </Button>
                        {/* <LoadingButton></LoadingButton> */}
                        <Button type='submit' loading={loading} variant="contained" >
                            Save Changes
                        </Button>
                    </Stack>
                </Stack>
                <Snackbar
                    open={success}
                    message="Profile updated successfully"
                    autoHideDuration={2000}
                ></Snackbar>
            </Paper>
        </Container>
        
    </>
}