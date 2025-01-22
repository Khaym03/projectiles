import { Switch } from './ui/switch'
import { Label } from './ui/label'

export interface switchOption {
  label: string
  checked: boolean
  handler: (v: boolean) => void
}

export default function SwitchesList({
  switches
}: {
  switches: switchOption[]
}) {
  return (
    <>
      {switches.map((switchOption, index) => (
        <Label key={index} className="text-white">
          {switchOption.label}

          <Switch
            checked={switchOption.checked}
            onCheckedChange={switchOption.handler}
          >
            Mostrar Vector de gravedad
          </Switch>
        </Label>
      ))}
    </>
  )
}
