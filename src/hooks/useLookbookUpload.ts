import { useMutation } from '@tanstack/react-query'
import { uploadLookbook } from '../api/lookbook'

export const useLookbookUpload = () => {
  return useMutation({
    mutationFn: uploadLookbook,
  })
}
