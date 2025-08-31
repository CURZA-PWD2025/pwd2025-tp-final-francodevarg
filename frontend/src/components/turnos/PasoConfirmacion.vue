<template>
  <div class="relative">
    <HeaderConfirmacion/>
    <section class="mt-4 rounded-2xl bg-white/90 backdrop-blur overflow-hidden">
      <div class="relative">
        <div class="p-5 md:p-6 space-y-6">
          <div class="flex items-start gap-4">
            <div class="timeline-dot">
              <User class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <h3 class="section-title">
                Profesional
                <span class="section-pill">
                  <Stethoscope class="h-3.5 w-3.5" /> {{ veterinario?.especialidad || '—' }}
                </span>
              </h3>
              <dl class="def-grid">
                <div>
                  <dt>Veterinario</dt>
                  <dd class="font-medium">{{ veterinario?.nombre || '—' }}</dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd class="font-medium">
                    <a v-if="veterinario?.telefono" :href="`tel:${veterinario.telefono}`" class="link">
                      {{ veterinario.telefono }}
                    </a>
                    <span v-else>—</span>
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt>Email</dt>
                  <dd class="font-medium">
                    <a v-if="veterinario?.email" :href="`mailto:${veterinario.email}`" class="link">
                      {{ veterinario.email }}
                    </a>
                    <span v-else>—</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <Separator />

          <div class="flex items-start gap-4">
            <div class="timeline-dot timeline-dot--soft">
              <Dog class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <h3 class="section-title">Paciente</h3>
              <dl class="def-grid">
                <div>
                  <dt>Mascota</dt>
                  <dd class="font-medium">{{ mascota?.nombre || '—' }}</dd>
                </div>
                <div>
                  <dt>Responsable</dt>
                  <dd class="font-medium">{{ user?.nombre || '—' }}</dd>
                </div>
                <div>
                  <dt>Especie</dt>
                  <dd class="font-medium">{{ mascota?.especie || '—' }}</dd>
                </div>
                <div>
                  <dt>Edad</dt>
                  <dd class="font-medium">
                    <span v-if="mascota?.edad !== undefined">{{ mascota.edad }} años</span>
                    <span v-else>—</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <Separator />

          <div class="flex items-start gap-4">
            <div class="timeline-dot timeline-dot--accent">
              <CalendarIcon class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <h3 class="section-title">
                Cita
                <span class="section-pill section-pill--muted">
                  <CalendarDays class="h-3.5 w-3.5" />
                  {{ fechaFormateada }} · {{ turno.hora || '—' }}
                </span>
              </h3>
              <dl class="def-grid">
                <div>
                  <dt>Fecha</dt>
                  <dd class="font-medium">{{ fechaFormateada }}</dd>
                </div>
                <div>
                  <dt>Hora</dt>
                  <dd class="font-medium">{{ turno.hora || '—' }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt>Motivo</dt>
                  <dd class="font-medium text-slate-800">{{ turno.motivo || 'No especificado' }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="z-10 sticky bottom-3 mt-4 flex items-center justify-between gap-3 bg-white/90 backdrop-blur px-3 py-2">
      <Button variant="ghost" class="gap-2" @click="$emit('prev')">
        <ArrowLeft class="h-6 w-6" />
        Atrás
      </Button>
      <div class="flex items-center gap-2">
        <Button
          class="gap-2 bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-white transition-colors"
          @click="$emit('finish')"
        >
          Confirmar
          <Check class="h-6 w-6" />
        </Button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTurnoStore } from '@/store/useTurnoStore'
import { storeToRefs } from 'pinia'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  Clock,
  Dog,
  User,
  Stethoscope
} from 'lucide-vue-next'
import HeaderConfirmacion from './HeaderConfirmacion.vue'
import { useAuthStore } from '@/store/useAuthStore'

const turnoStore = useTurnoStore()
const authStore = useAuthStore()
const { turno, mascota, veterinario } = storeToRefs(turnoStore)
const { user} = storeToRefs(authStore)

const fechaFormateada = computed(() => {
  const f = turno.value?.fecha
  if (!f) return '—'
  const [y, m, d] = f.split('-')
  return y && m && d ? `${d}/${m}/${y}` : f
})
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.chip--dark {
  background: rgba(0,0,0,0.30);
  border-color: rgba(0,0,0,0.20);
  color: #fff;
}
.section-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.2rem;
  color: #0f172a;
}
.section-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.125rem 0.5rem;
  font-size: 12px;
  line-height: 1rem;
  border-radius: 9999px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.section-pill--muted {
  background: #f8fafc;
  color: #334155;
  border-color: #e2e8f0;
}
.timeline-dot {
  height: 2rem;
  width: 2rem;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 9999px;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.timeline-dot--soft {
  color: #059669;
  background: #ecfdf5;
  border-color: #d1fae5;
}
.timeline-dot--accent {
  color: #4f46e5;
  background: #eef2ff;
  border-color: #e0e7ff;
}
.def-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem 1.5rem;
  font-size: 0.9375rem;
  margin-top: 0.75rem;
}
@media (min-width: 640px) {
  .def-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.def-grid dt {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}
.def-grid dd {
  color: #0f172a;
}
.link {
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color .15s ease, text-decoration .15s ease;
}
.link:hover {
  text-decoration: none;
  color: #1d4ed8;
}
.link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
