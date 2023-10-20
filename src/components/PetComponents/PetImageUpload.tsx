import { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FieldsState } from '../../types/common'
import PetImageThumbs from './PetImageThumbs'

interface FileInputProps {
  selectedFiles: File[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
  previews: string[]
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  errors: FieldsState
  setErrors: React.Dispatch<React.SetStateAction<FieldsState>>
  addPetState: FieldsState
  validateField: (id: string, value: string, state: FieldsState) => string
}

export const FileInput = ({
  selectedFiles,
  setSelectedFiles,
  previews,
  setPreviews,
  errors,
  setErrors,
  addPetState,
  validateField
}: FileInputProps) => {
  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    previews.forEach((preview) => URL.revokeObjectURL(preview))
  }, [previews])

  // Use the useDropzone hook to create the dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = 10 - selectedFiles.length
      const newFiles = acceptedFiles.slice(0, remainingSlots)

      // Filter only image files
      const imageFiles = newFiles.filter((file) =>
        file.type.startsWith('image/')
      )

      // Filter non-image files
      const nonImageFiles = newFiles.filter(
        (file) => !file.type.startsWith('image/')
      )

      // Set error for non-image files
      if (nonImageFiles.length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          images: 'Only image files are allowed.'
        }))
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          images: fieldError
        }))
      }

      setSelectedFiles((prevSelectedFiles) => [
        ...prevSelectedFiles,
        ...imageFiles
      ])
      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file))
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])

      const allFiles = [...selectedFiles, ...acceptedFiles]

      const fieldError = validateField(
        'images',
        allFiles.length.toString(),
        addPetState
      )
    },

    [
      addPetState,
      setSelectedFiles,
      setPreviews,
      setErrors,
      validateField,
      selectedFiles
    ]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  })

  const removeFile = (index: number) => {
    setSelectedFiles((prevSelectedFiles) => {
      const updatedSelectedFiles = [...prevSelectedFiles]
      updatedSelectedFiles.splice(index, 1)
      return updatedSelectedFiles
    })
    setPreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews]
      updatedPreviews.splice(index, 1)
      return updatedPreviews
    })
    const allFiles = selectedFiles.filter((_, i) => i !== index)
    console.log(allFiles.length.toString())
    const fieldError = validateField(
      'images',
      allFiles.length.toString(),
      addPetState
    )

    setErrors((prevErrors) => ({
      ...prevErrors,
      images: fieldError
    }))
  }

  return (
    <div key="images" className="col-span-1 md:col-span-2 lg:col-span-1 my-5">
      <label className="text-gray-700 font-medium text-lg" htmlFor="images">
        Images
      </label>
      <div
        data-cy="image-upload"
        {...getRootProps()}
        className="w-full mt-2 h-28 border-2 border-dashed border-gray-400 rounded-md flex justify-center items-center mb-5"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p className="p-4 text-center cursor-pointer">
            Drag 'n' drop files here, or click to select files
          </p>
        )}
      </div>
      <PetImageThumbs
        previews={previews}
        selectedFiles={selectedFiles}
        removeFile={removeFile}
      />
      <span className="text-gray-500 mr-2 ml-2">
        {selectedFiles && selectedFiles.length > 0
          ? `${selectedFiles.length} files selected`
          : 'No files chosen'}
      </span>
      {errors['images'] && (
        <p className="text-red-500 text-xs mt-1">{errors['images']}</p>
      )}
    </div>
  )
}
