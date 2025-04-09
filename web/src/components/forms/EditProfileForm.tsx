import { ArrowLeft, Check, Cross, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function EditProfileForm() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-4 items-center py-2 px-2 mr-auto">
                <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)}/>
                <h1 className="font-semibold text-lg">Edit Profile</h1>
            </div>
           
            <div className="flex-grow flex justify-center items-center px-4">
                <form className="w-full max-w-md p-6 rounded-lg shadow-md text-black bg-white">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <img src="" alt="" className="w-24 h-24 rounded-full bg-indigo-400" />
                        <label htmlFor="media" className="flex flex-col items-center cursor-pointer text-indigo-800 font-medium">
                            Change profile picture
                        </label>
                        <input type="file" name="media" className="hidden" id="media"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <EditProfileInput name={"Name"} placeholder={"John Doe"}/>
                        <EditProfileInput name={"Username"} placeholder={"john_doe"}/>
                        <EditProfileInput name={"Pronouns"} placeholder={"he/him"}/>
                        <EditProfileInput name={"Bio"} placeholder={"I am John Doe, a simpleton"}/>
                        <EditProfileInput name={"Gender (not a part of public profile)"} placeholder={"Male"}/>
                    </div>
                    <div className="flex justify-center gap-8 mt-4">
                        <button className="flex items-center gap-2 group transition-colors bg-gray-100 duration-500 hover:bg-red-100 px-3 py-2 rounded-lg cursor-pointer">
                            <div className="transition-colors duration-500 group-hover:text-red-500">
                                <X />
                            </div>
                            <div className="transition-colors duration-500 group-hover:text-red-500">
                                Cancel
                            </div>
                        </button>

                        <button className="flex items-center gap-2 group bg-gray-100 transition-colors duration-500 hover:bg-green-200 px-3 py-2 rounded-lg cursor-pointer">
                            <div className="transition-colors duration-500 group-hover:text-green-600">
                                <Check />
                            </div>
                            <div className="transition-colors duration-500 group-hover:text-green-600">
                                Save
                            </div>
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )
}

interface EditProfileInterface {
    name: string
    placeholder: string
}

function EditProfileInput({name, placeholder}: EditProfileInterface) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-indigo-800 font-semibold">{name}</label>
            <input type="text" placeholder={placeholder} className="bg-indigo-200 p-2 rounded transition-shadow duration-500 appearance-none outline-none border-none hover:shadow-md hover:shadow-indigo-400"/>
        </div>
    )
}