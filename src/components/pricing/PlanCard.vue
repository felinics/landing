<template>
  <!-- A highlighted tier carries the operator's "recommended" accent: a primary
       border instead of the hairline. It stays a border, not a fill, so the
       card's content contrast is untouched. -->
  <article
    class="flex min-h-[24rem] flex-col gap-5 rounded-menu-shell border bg-card p-5"
    :class="highlighted ? 'border-primary' : 'border-border'"
  >
    <header class="flex flex-col gap-1.5">
      <div class="flex min-h-5 items-center justify-between gap-2">
        <h3 class="min-w-0 truncate text-title font-semibold text-foreground">
          {{ name }}
        </h3>
        <!-- One badge slot: "current" states a fact about this workspace and
             outranks the operator's marketing accent. -->
        <Badge
          v-if="current"
          variant="secondary"
        >
          {{ currentLabel }}
        </Badge>
        <Badge
          v-else-if="highlighted && highlightLabel"
          variant="default"
        >
          {{ highlightLabel }}
        </Badge>
      </div>
      <!-- Two lines are reserved whether the tagline needs them or not, so the
           price and the feature list below start on the same baseline in every
           card of the row. Without it a tier whose tagline wraps pushes its own
           price down and the row stops reading as a comparison. -->
      <p class="line-clamp-2 min-h-[2rem] text-body text-muted-foreground">
        {{ tagline }}
      </p>
    </header>

    <div class="flex flex-col gap-0.5">
      <p class="flex flex-wrap items-baseline gap-x-1.5">
        <span class="text-display font-semibold tabular-nums text-foreground">
          {{ price }}
        </span>
        <span
          v-if="priceSuffix"
          class="text-body text-muted-foreground"
        >
          {{ priceSuffix }}
        </span>
        <!-- The struck original price sits after the live one: the number the
             user pays stays the loudest thing on the line. -->
        <span
          v-if="originalPrice"
          class="text-body tabular-nums text-muted-foreground line-through"
        >
          {{ originalPrice }}
        </span>
      </p>
      <p
        v-if="priceNote"
        class="text-caption text-muted-foreground"
      >
        {{ priceNote }}
      </p>
    </div>

    <ul class="flex flex-1 flex-col gap-2.5">
      <!-- An emphasised line is the tier's headline benefit: it steps up to the
           foreground color while the rest of the list stays muted. -->
      <li
        v-for="(feature, index) in features"
        :key="index"
        class="flex items-start gap-2 text-body"
        :class="feature.emphasis ? 'font-medium text-foreground' : 'text-muted-foreground'"
      >
        <Check class="mt-0.5 size-3.5 shrink-0" />
        <span class="min-w-0">{{ feature.text }}</span>
      </li>
    </ul>

    <Button
      :variant="current ? 'secondary' : 'primary'"
      :disabled="ctaDisabled"
      class="w-full"
      @click="emit('select')"
    >
      {{ ctaLabel }}
    </Button>
  </article>
</template>

<script setup lang="ts">
import { Badge } from './vendor/badge'
import { Button } from './vendor/button'
import { Check } from 'lucide-vue-next'

// PlanCard — the pricing tile: name + tagline, one price line, a checked
// feature list, and exactly one CTA pinned to the foot.
//
// Why this is its own component rather than a BackendCard or a SettingsRow:
// a pricing tile is a different spatial relationship from both. BackendCard is
// a one-line "pick this object" row whose WHOLE surface is the click target;
// here the card is not clickable — the CTA at its foot is, and the card also
// has to carry a price and a multi-line feature list. Cleared with the
// developer before being written (ui-owners § "a genuinely new component is a
// last resort").
//
// The min-height is what makes five of these read as a row of tall panels
// rather than five squat boxes; the feature list takes the slack so the CTA
// sits on a shared baseline across the row no matter how many features a tier
// lists.
//
// It stays dumb on purpose: every string arrives already translated and
// already formatted. Picking the plan, resolving the current tier, and
// formatting money all live in plan-cards.vue, so this file has no business
// logic to drift.
defineProps<{
  name: string
  tagline: string
  /** Already formatted for display ("$5.00" / "Free" / "Custom"). */
  price: string
  /** Billing-interval suffix ("/mo"); empty for free and quote-only plans. */
  priceSuffix?: string
  /** Struck-through original price, already formatted; empty hides it. */
  originalPrice?: string
  /** One-line note under the price ("按年付享 8 折"), operator-authored. */
  priceNote?: string
  /** Already-resolved feature lines; emphasis steps a line up to foreground. */
  features: { text: string, emphasis?: boolean }[]
  /** Operator's "recommended" accent: primary border + badge (unless current). */
  highlighted?: boolean
  highlightLabel?: string
  /** Marks this as the workspace's current tier: badge + a calmer CTA. */
  current?: boolean
  currentLabel: string
  ctaLabel: string
  ctaDisabled?: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>
