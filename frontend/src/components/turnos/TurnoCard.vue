<template>
  <Card class="border-slate-200/70 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
    <!-- HEADER -->
    <CardHeader
      :id="headerId"
      class="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-3 gap-3 select-none"
    >
      <div class="flex items-center gap-4 cursor-pointer flex-1" role="button"
           :aria-expanded="expanded" :aria-controls="contentId"
           @click="toggle">
        <div
          class="w-11 h-11 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <CalendarClock class="w-5 h-5" />
        </div>

        <!-- Resumen compacto -->
        <div class="leading-tight">
          <p class="text-lg font-bold text-slate-900 leading-snug">
            {{ fechaLegible }} · {{ hora }} hs
          </p>
          <div class="flex items-center gap-2 mt-1 text-sm text-slate-800">
            <UserRound class="w-4 h-4 text-primary/80" />
            <span class="font-medium">{{ veterinarioNombre }}</span>
            <span class="hidden sm:inline text-slate-400">—</span>
            <span class="sm:inline-block rounded-full border bg-slate-50 px-2 py-0.5 text-[12px] text-slate-700 leading-none">
              {{ especialidad }}
            </span>
            <span class="hidden sm:inline text-slate-400">—</span>
            <Dog class="w-4 h-4" />
            <span class="font-medium">{{ mascotaNombre }}</span>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas + Estado + Toggle -->
      <div class="flex items-center gap-2">
        <!-- Acciones solo si pendiente y no forzadas a ocultarse -->
        <template v-if="accionVisible">
          <Button
            variant="outline"
            class="h-8 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            @click.stop="onCancelar"
          >
            <XCircle class="w-4 h-4 mr-1" /> Cancelar
          </Button>
          <Button
            class="h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            @click.stop="onConfirmar"
          >
            <Check class="w-4 h-4 mr-1" /> Confirmar
          </Button>
        </template>

        <Badge :class="badgeClass(turno.estado)" class="rounded-full px-2.5 py-1 text-[12px]">
          {{ estadoLabel(turno.estado) }}
        </Badge>

        <!-- Botón de expandir -->
        <Button
          variant="ghost"
          class="h-9 w-9 p-0 rounded-full"
          @click.stop="toggle"
          :aria-controls="contentId"
          :aria-expanded="expanded"
        >
          <ChevronDown class="h-5 w-5 transition-transform" :class="expanded ? 'rotate-180' : ''" />
        </Button>
      </div>
    </CardHeader>

    <!-- BODY con transición -->
    <Transition name="exp" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
      <div v-show="expanded" :id="contentId">
        <CardContent class="pt-0 space-y-3">
          <!-- Detalles -->
          <div class="grid gap-2 md:grid-cols-3">
            <div class="detail">
              <CalendarRange class="w-4 h-4" />
              <div class="detail-col">
                <span class="detail-label">Día y hora</span>
                <span class="detail-value">{{ fechaLegible }} · {{ hora }} hs</span>
              </div>
            </div>
            <div class="detail">
              <Dog class="w-4 h-4" />
              <div class="detail-col">
                <span class="detail-label">Mascota</span>
                <span class="detail-value">{{ mascotaNombre }}</span>
              </div>
            </div>
            <div class="detail">
              <UserRound class="w-4 h-4" />
              <div class="detail-col">
                <span class="detail-label">Veterinario</span>
                <span class="detail-value">{{ veterinarioNombre }}</span>
              </div>
            </div>
          </div>

          <div class="grid gap-2 md:grid-cols-3">
            <div class="detail">
              <Stethoscope class="w-4 h-4" />
              <div class="detail-col">
                <span class="detail-label">Especialidad</span>
                <span class="detail-value">{{ especialidad }}</span>
              </div>
            </div>
            <div class="detail">
              <Timer class="w-4 h-4" />
              <div class="detail-col">
                <span class="detail-label">Estado</span>
                <span class="detail-value">{{ estadoLabel(turno.estado) }}</span>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div class="chip-muted truncate">
                    <span class="chip-muted-label">Motivo:</span>
                    <span class="truncate">{{ turno.motivo || '—' }}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent class="max-w-[320px] text-sm">
                  {{ turno.motivo || 'Sin motivo especificado' }}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </div>
    </Transition>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Turno } from '@/types/Turno'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  CalendarClock,
  CalendarRange,
  ChevronDown,
  Check,
  Dog,
  Stethoscope,
  Timer,
  UserRound,
  XCircle
} from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const props = withDefaults(defineProps<{ turno: Turno; defaultExpanded?: boolean; idBase?: string }>(), {
  defaultExpanded: false,
  idBase: 'turno-card'
})

const emit = defineEmits<{
  (e: 'cancelar', id: number): void
  (e: 'confirmar', id: number): void
}>()

const expanded = ref<boolean>(props.defaultExpanded)
const headerId = computed(() => `${props.idBase}-${props.turno.id}-header`)
const contentId = computed(() => `${props.idBase}-${props.turno.id}-content`)

const fechaRaw = new Date(props.turno.fecha)
const fechaLegible = fechaRaw
  .toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' })
  .replace(/\b\w/g, l => l.toUpperCase())
const hora = props.turno.hora.slice(0, 5) // "HH:MM:SS" -> "HH:MM"

const veterinarioNombre = (props.turno as any)?.veterinario?.nombre ?? '—'
const especialidad = (props.turno as any)?.veterinario?.especialidad ?? '—'
const mascotaNombre = (props.turno as any)?.mascota?.nombre ?? '—'

/** Visibilidad de acciones en header:
 *  - baseAccionVisible: true si turno está 'pendiente'
 *  - localForcedHidden: se pone true al clickear confirmar/cancelar para ocultar de inmediato (optimistic)
 *  - Si el estado cambia a algo != 'pendiente', se resetea el flag.
 */
const baseAccionVisible = computed(() => props.turno.estado === 'Pendiente')
const localForcedHidden = ref(false)
const accionVisible = computed(() => baseAccionVisible.value && !localForcedHidden.value)
watch(baseAccionVisible, (v) => { if (!v) localForcedHidden.value = false })

function estadoLabel(e: Turno['estado']) {
  return { Confirmado: 'Confirmado', Pendiente: 'Pendiente', Cancelado: 'Cancelado'}[e] ?? '—'
}
function badgeClass(e: Turno['estado']) {
  return {
    Confirmado: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    Pendiente: 'bg-amber-100 text-amber-700 border border-amber-200',
    Cancelado: 'bg-rose-100 text-rose-700 border border-rose-200'
  }[e] ?? 'bg-slate-100 text-slate-700 border border-slate-200'
}

function toggle() { expanded.value = !expanded.value }

function onCancelar() {
  localForcedHidden.value = true
  emit('cancelar', props.turno.id!)
}
function onConfirmar() {
  localForcedHidden.value = true
  emit('confirmar', props.turno.id!)
}

/* Transición altura auto */
function onEnter(el: Element) { const e = el as HTMLElement; e.style.height = '0px'; e.style.overflow = 'hidden'; requestAnimationFrame(() => { e.style.transition = 'height 220ms ease'; e.style.height = `${e.scrollHeight}px`; }) }
function onAfterEnter(el: Element) { const e = el as HTMLElement; e.style.height = 'auto'; e.style.overflow = ''; e.style.transition = '' }
function onLeave(el: Element) { const e = el as HTMLElement; e.style.height = `${e.scrollHeight}px`; e.style.overflow = 'hidden'; requestAnimationFrame(() => { e.style.transition = 'height 200ms ease'; e.style.height = '0px'; }) }
</script>

<style scoped>
.exp-enter-from, .exp-leave-to { opacity: 0.98; }
.exp-enter-active, .exp-leave-active { transition: opacity 180ms ease; }

.detail { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; min-height: 44px; }
.detail-col { display: flex; flex-direction: column; gap: 2px; }
.detail-label { font-size: 12px; color: #64748b; }
.detail-value { font-size: 14px; font-weight: 600; color: #1f2937; }

.chip-muted { display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; border: 1px dashed #e2e8f0; border-radius: 12px; background: #f8fafc; font-size: 13px; color: #334155; min-width: 0; }
.chip-muted-label { font-weight: 600; color: #64748b; }
</style>
