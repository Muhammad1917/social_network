import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle  , CardAction} from '../../components/ui/card';


export default function EditProfile() {
    return <>
        <Card>
            <CardHeader>
                <CardTitle>Edit Your Profile Here</CardTitle>
                <CardDescription></CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
        ProfileHeader

        ProfileAvatar

        ProfileCover

        ProfileInfo

        ProfileBio

        EditProfileForm
    </>
}