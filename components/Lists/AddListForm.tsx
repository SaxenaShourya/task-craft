"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "@/hooks/use-action"
import { createList } from "@/actions/Lists/createList/action"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CreateListSchema, InputType } from "@/actions/Lists/createList/types"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'

import Spinner from '../Spinner'
import FormError from '../FormError'

const AddListForm = () => {
  const params = useParams()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InputType>({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      title: "",
      boardId: params.boardId as string,
    },
  })

  const { execute, fieldErrors, isLoading } = useAction(createList, {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "List created successfully",
        variant: "default",
      })
      reset()
      setIsOpen(false)
    },
    onError: (error) => {
      toast({
        title: error.title,
        description: error.description,
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: InputType) => {
    execute(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto w-auto px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-none"
        >
        <Plus className='w-4 h-4 mr-2' />
          Add List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              List Title
            </Label>
            <Input
              id="title"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter list name"
            />
            {fieldErrors?.title && (
              <FormError message={fieldErrors.title[0]} />
            )}
            {!fieldErrors?.title && errors.title?.message && (
              <FormError message={errors.title.message} />
            )}
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="px-4 py-2 text-white rounded-md transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Create List"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddListForm