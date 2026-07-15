import { useMutation } from '@tanstack/react-query'
import { requestPresignedUrl, uploadFileToPresignedUrl } from '../api/upload'

const uploadImageFlow = async (file: File): Promise<{ imageId: string }> => {
  const { presignedUrl, imageId } = await requestPresignedUrl(file)
  await uploadFileToPresignedUrl(presignedUrl, file)
  // TODO: 업로드 완료를 백엔드에 별도로 알려야 하는지(업로드 완료 API 존재 여부) 미확정
  return { imageId }
}

export const useImageUpload = () => {
  const mutation = useMutation({ mutationFn: uploadImageFlow })

  return {
    uploadImage: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error,
  }
}
