<template>
  <section class="page">
    <div class="layout">
      <!-- Sol: Filtreler (Desktop) -->
      <aside class="sidebar">
        <div class="sidebarCard">
          <div class="sidebarTitle">Filtreler</div>
          <div class="sidebarDesc">Model yılına göre filtrele</div>

          <div class="filterGroup">
            <label class="filterLabel">Model Yılı (Min)</label>
            <input
                v-model="minYearInput"
                class="textInput"
                type="number"
                inputmode="numeric"
                placeholder="Örn: 2018"
                min="1900"
                max="2100"
            />
          </div>

          <div class="filterGroup">
            <label class="filterLabel">Model Yılı (Max)</label>
            <input
                v-model="maxYearInput"
                class="textInput"
                type="number"
                inputmode="numeric"
                placeholder="Örn: 2024"
                min="1900"
                max="2100"
            />
          </div>

          <button class="applyBtn" type="button" @click="applyFilters">
            Filtrele
          </button>
          <button class="clearBtn" type="button" @click="clearFilters">
            Temizle
          </button>

          <div v-if="filterError" class="filterError">
            {{ filterError }}
          </div>
        </div>
      </aside>

      <!-- Sağ: Liste -->
      <main class="content">
        <header class="pageHeader">
          <div class="listingTitleWrap">
            <h1 class="title">İlanlar</h1>
          </div>

          <div class="controls">
            <!-- Mobilde sidebar yerine -->
            <button class="filterBtn" type="button" @click="showFilter = true">
              <i class="pi pi-filter" /> Filtre
            </button>

            <label class="control">
              <span>Adet</span>
              <select v-model.number="take" @change="onTakeChange" class="select">
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
            </label>

            <label class="control">
              <span>Sırala</span>
              <select v-model.number="sort" @change="reloadFromStart" class="select">
                <option :value="1">Tarih</option>
                <option :value="0">Fiyat</option>
                <option :value="2">Yıl</option>
              </select>
            </label>

            <label class="control">
              <span>Yön</span>
              <select v-model.number="sortDirection" @change="reloadFromStart" class="select">
                <option :value="0">Artan</option>
                <option :value="1">Azalan</option>
              </select>
            </label>
          </div>
        </header>

        <div v-if="error" class="state error">Hata: {{ error }}</div>

        <div class="tableWrap">
          <DataTable
              :value="items"
              dataKey="id"
              class="p-datatable-sm"
              responsiveLayout="scroll"
              :loading="loading"
              lazy
              paginator
              :rows="take"
              :first="skip"
              :totalRecords="totalRecords"
              @page="onPage"
              @row-click="onRowClick"
          >
            <Column header="" style="width: 130px">
              <template #body="{ data }">
                <img
                    class="thumb"
                    :src="resolvePhotoUrl(data.photo, '240x180')"
                    :alt="data.title"
                    loading="lazy"
                />
              </template>
            </Column>

            <Column header="Model" style="min-width: 220px">
              <template #body="{ data }">
                <div class="modelName">{{ data.modelName }}</div>
                <div class="meta">#{{ data.id }}</div>
              </template>
            </Column>

            <Column header="İlan Başlığı" style="min-width: 360px">
              <template #body="{ data }">
                <div class="listingTitle">{{ data.title }}</div>
                <div class="meta hideSm">{{ data.category?.name }}</div>
              </template>
            </Column>

            <Column header="Yıl" style="width: 90px" class="hideSm">
              <template #body="{ data }">
                {{ getProp(data.properties, 'year') || '-' }}
              </template>
            </Column>

            <Column header="Km" style="width: 110px" class="hideMd">
              <template #body="{ data }">
                {{ formatKm(getProp(data.properties, 'km')) }}
              </template>
            </Column>

            <Column header="Renk" style="width: 120px" class="hideMd">
              <template #body="{ data }">
                {{ getProp(data.properties, 'color') || '-' }}
              </template>
            </Column>

            <Column header="Fiyat" style="width: 140px">
              <template #body="{ data }">
                <span class="priceText">{{ data.priceFormatted }}</span>
              </template>
            </Column>

            <Column header="Tarih" style="width: 160px" class="hideSm">
              <template #body="{ data }">
                {{ data.dateFormatted }}
              </template>
            </Column>

            <Column header="İl / İlçe" style="width: 170px" class="hideMd">
              <template #body="{ data }">
                {{ data.location?.cityName }} / {{ data.location?.townName }}
              </template>
            </Column>

            <Column header="" style="width: 110px">
              <template #body="{ data }">
                <button class="detailBtn" type="button" @click.stop="goDetail(data.id)">
                  Detay
                </button>
              </template>
            </Column>
          </DataTable>
        </div>
      </main>
    </div>

    <!-- Mobil filtre dialog -->
    <Dialog
        v-model:visible="showFilter"
        modal
        header="Filtreler"
        style="width: 100%; max-width: 420px"
    >
      <div class="filterGroup">
        <label class="filterLabel">Model Yılı (Min)</label>
        <input
            v-model="minYearInput"
            class="textInput"
            type="number"
            inputmode="numeric"
            placeholder="Örn: 2018"
            min="1900"
            max="2100"
        />
      </div>

      <div class="filterGroup">
        <label class="filterLabel">Model Yılı (Max)</label>
        <input
            v-model="maxYearInput"
            class="textInput"
            type="number"
            inputmode="numeric"
            placeholder="Örn: 2024"
            min="1900"
            max="2100"
        />
      </div>

      <div v-if="filterError" class="filterError">
        {{ filterError }}
      </div>

      <div class="dialogActions">
        <button class="applyBtn" type="button" @click="applyFilters">Uygula</button>
        <button class="clearBtn" type="button" @click="clearFilters">Temizle</button>
      </div>
    </Dialog>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import { useQuery } from "@tanstack/vue-query";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";

import { getListing } from "@/core/api/adverts.service";
import { resolvePhotoUrl, getProp, formatKm } from "@/core/api/adverts.helpers";

const router = useRouter();

// pagination
const take = ref(20);
const skip = ref(0);

// sort
const sort = ref(1); // 0: price, 1: date, 2: year
const sortDirection = ref(0); // 0 asc, 1 desc

// filters (year)
const minYearInput = ref("");
const maxYearInput = ref("");
const filterError = ref(null);

const showFilter = ref(false);

// ---- helpers
function goDetail(id) {
  router.push(`/advert/${id}`);
}

function onRowClick(event) {
  const id = event?.data?.id;
  if (id) goDetail(id);
}

function parseYear(input) {
  const s = String(input ?? "").trim();
  if (!s) return undefined;

  const n = Number(s);
  if (!Number.isFinite(n)) return undefined;
  if (!Number.isInteger(n)) return undefined;
  if (n < 1900 || n > 2100) return undefined;

  return n;
}

const minYear = computed(() => parseYear(minYearInput.value));
const maxYear = computed(() => parseYear(maxYearInput.value));

function validateYearRange() {
  filterError.value = null;

  if (String(minYearInput.value).trim() && minYear.value === undefined) {
    filterError.value = "Min yıl geçersiz. Örn: 2018";
    return false;
  }
  if (String(maxYearInput.value).trim() && maxYear.value === undefined) {
    filterError.value = "Max yıl geçersiz. Örn: 2024";
    return false;
  }

  if (
      minYear.value !== undefined &&
      maxYear.value !== undefined &&
      minYear.value > maxYear.value
  ) {
    filterError.value = "Min yıl, max yıldan büyük olamaz.";
    return false;
  }

  return true;
}


const listingParams = computed(() => ({
  sort: sort.value,
  sortDirection: sortDirection.value,
  take: take.value,
  skip: skip.value,
  ...(minYear.value !== undefined ? { minYear: minYear.value } : {}),
  ...(maxYear.value !== undefined ? { maxYear: maxYear.value } : {}),
}));


const listingQuery = useQuery({
  queryKey: computed(() => ["adverts", "listing", listingParams.value]),
  queryFn: () => getListing(listingParams.value),
  keepPreviousData: true,

});

const items = computed(() => {
  const data = listingQuery.data.value;
  return Array.isArray(data) ? data : (data?.items || data?.listings || []);
});

const loading = computed(() => listingQuery.isFetching.value);
const error = computed(() => listingQuery.error.value?.message ?? null);


const totalRecords = computed(() => {
  const data = listingQuery.data.value;
  return data?.totalRecords ?? data?.total ?? 1000;
});

// ---- UI events
function reloadFromStart() {
  skip.value = 0;

}

function onTakeChange() {
  reloadFromStart();
}

function onPage(event) {
  skip.value = event.first;
  take.value = event.rows;

}

function applyFilters() {
  if (!validateYearRange()) return;
  skip.value = 0;
  showFilter.value = false;

}

function clearFilters() {
  minYearInput.value = "";
  maxYearInput.value = "";
  filterError.value = null;
  skip.value = 0;
  showFilter.value = false;

}
</script>
