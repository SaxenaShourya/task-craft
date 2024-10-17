import Image from 'next/image'
import { CreditCard } from 'lucide-react'
import { OrganizationResource } from '@clerk/types'

const Info = ({org}: {org: OrganizationResource}) => {

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-14 h-14 relative">
        <Image
          fill
          src={org?.imageUrl}
          alt="Organization"
          className="rounded-md object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-xl">{org?.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3 mr-1" />
          Free
        </div>
      </div>
    </div>
  )
}

export default Info