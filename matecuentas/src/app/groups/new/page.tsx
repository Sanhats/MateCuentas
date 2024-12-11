import CreateGroupForm from '@/components/groups/CreateGroupForm'

export default function NewGroupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-handwriting text-yerba mb-8">Crear nuevo grupo de mate</h1>
      <div className="max-w-md mx-auto">
        <CreateGroupForm />
      </div>
    </div>
  )
}

