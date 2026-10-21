<template>
  <main class='container py-5 subscription-page'>
    <section class='subscription-hero rounded-4 p-4 p-md-5 mb-4 text-white'>
      <div class='row align-items-center g-4'>
        <div class='col-md-8'>
          <span class='text-uppercase small fw-bold opacity-75'>Membership</span>
          <h1 class='display-6 fw-bold mt-2 mb-3'>Keep your store experience simple.</h1>
          <p class='mb-0 opacity-90'>Subscribe once and Stripe will automatically charge your saved payment method on every billing cycle.</p>
        </div>
        <div class='col-md-4 text-md-end'>
          <CreditCard :size='72' :stroke-width='1.2' class='opacity-75' />
        </div>
      </div>
    </section>
    <section class='card border-0 shadow-sm rounded-4'>
      <div class='card-body p-4 p-md-5'>
        <div v-if='loading' class='text-center py-5'>
          <div class='spinner-border text-success' role='status'></div>
          <p class='text-muted mt-3 mb-0'>Loading subscription details...</p>
        </div>
        <template v-else>
          <div v-if='notice' class='alert alert-info rounded-3'>{{ notice }}</div>
          <div v-if='!configured' class='alert alert-warning rounded-3'>Subscription pricing has not been configured by the store administrator yet.</div>
          <div v-if='subscription' class='row align-items-center g-4'>
            <div class='col-md-8'>
              <span class='badge rounded-pill text-bg-success mb-3'>{{ statusLabel }}</span>
              <h2 class='h4 mb-2'>Your subscription is active in Stripe</h2>
              <p class='text-muted mb-2'>Next billing date: <strong>{{ formatDate(subscription.current_period_end) }}</strong></p>
              <p v-if='subscription.cancel_at_period_end' class='text-warning mb-0'>Cancellation is scheduled at the end of the current billing period.</p>
            </div>
            <div class='col-md-4 text-md-end'>
              <button class='btn btn-outline-success rounded-pill px-4' :disabled='actionLoading' @click='openPortal'>
                <span v-if='actionLoading' class='spinner-border spinner-border-sm me-2'></span>
                Manage billing
              </button>
            </div>
          </div>
          <div v-else class='row align-items-center g-4'>
            <div class='col-md-8'>
              <h2 class='h4 mb-2'>Start your subscription</h2>
              <p class='text-muted mb-0'>Stripe Checkout securely collects your card and enables automatic recurring payments. You can update or cancel billing from the Stripe customer portal at any time.</p>
            </div>
            <div class='col-md-4 text-md-end'>
              <button class='btn bg-btn text-white rounded-pill px-4' :disabled='actionLoading || !configured' @click='startCheckout'>
                <span v-if='actionLoading' class='spinner-border spinner-border-sm me-2'></span>
                Subscribe now
              </button>
            </div>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CreditCard } from 'lucide-vue-next'
import api from '@/api/https'
import { notify } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const toast = notify(router)
const loading = ref(true)
const actionLoading = ref(false)
const configured = ref(false)
const subscription = ref(null)
const notice = ref('')

const statusLabel = computed(() => {
  const status = subscription.value?.status || 'unknown'
  return status.replaceAll('_', ' ')
})

function formatDate(value) {
  if (!value) return 'Not available'
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function loadSubscription() {
  try {
    const response = await api.get('/api/profile/subscription')
    configured.value = response.data.data.configured
    subscription.value = response.data.data.subscription
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Unable to load subscription.')
  } finally {
    loading.value = false
  }
}

async function startCheckout() {
  actionLoading.value = true
  try {
    const response = await api.post('/api/subscriptions/checkout')
    window.location.assign(response.data.data.url)
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Unable to start checkout.')
    actionLoading.value = false
  }
}

async function openPortal() {
  actionLoading.value = true
  try {
    const response = await api.post('/api/subscriptions/portal')
    window.location.assign(response.data.data.url)
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Unable to open billing management.')
    actionLoading.value = false
  }
}

onMounted(async () => {
  if (route.query.checkout === 'success') {
    notice.value = 'Checkout completed. Stripe is confirming your subscription; this page will refresh shortly.'
    await loadSubscription()
    window.setTimeout(loadSubscription, 2000)
    return
  }
  if (route.query.checkout === 'cancelled') notice.value = 'Checkout was cancelled. No recurring charge was created.'
  await loadSubscription()
})
</script>

<style scoped>
.subscription-page { max-width: 980px; }
.subscription-hero { background: linear-gradient(135deg, #35495e, #42b883); }
.opacity-90 { opacity: 0.9; }
</style>
