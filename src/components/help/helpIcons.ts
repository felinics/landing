import type { FunctionalComponent } from 'vue'
import {
  Bot,
  Clock3,
  CreditCard,
  Laptop,
  MonitorPlay,
  Rocket,
  Send,
  ShieldCheck,
} from 'lucide-vue-next'
import type { HelpIconName } from '../../lib/help'

export const helpIcons: Record<HelpIconName, FunctionalComponent> = {
  rocket: Rocket,
  monitor: MonitorPlay,
  bot: Bot,
  send: Send,
  clock: Clock3,
  creditCard: CreditCard,
  laptop: Laptop,
  shield: ShieldCheck,
}
