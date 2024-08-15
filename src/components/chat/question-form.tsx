import { ActionIcon, Flex, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconSend2 } from '@tabler/icons-react'
import { ConversationType, MessageType } from '~/types/conversation'
import { useConversation } from '~/hooks/useConversation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

interface FormValues {
  content: string
}

interface QuestionFormProps {
  id: number
  refetchConversation: () => void
  setPendingMessage: (message: string) => void
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  id,
  refetchConversation,
  setPendingMessage
}) => {
  const { sendMessage } = useConversation

  const accessToken = useSelector((state: RootState) => state.auth.access_token)

  const form = useForm<FormValues>({
    initialValues: {
      content: ''
    }
  })

  const handleSubmit = async () => {
    if (!accessToken) {
      throw new Error('Access token is required')
    }

    setPendingMessage(form.getValues().content)

    await sendMessage(accessToken, id, form.getValues())
    form.reset()

    refetchConversation()

    setPendingMessage('')
  }

  const mutation = useMutation({
    mutationFn: () => handleSubmit()
  })

  return (
    <form onSubmit={form.onSubmit(() => mutation.mutate())}>
      <Flex align="flex-end" gap={16}>
        <Textarea
          {...form.getInputProps('content')}
          className="w-[640px]"
          label="Ask here"
          autosize
          maxRows={6}
        />
        <ActionIcon
          size={36}
          type="submit"
          disabled={!form.getValues().content || mutation.status === 'pending'}
        >
          <IconSend2 />
        </ActionIcon>
      </Flex>
    </form>
  )
}

export default QuestionForm
