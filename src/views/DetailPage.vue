<template>
  <section class="page detailPage">
    <div v-if="loading" class="state">Yükleniyor…</div>
    <div v-else-if="error" class="state error">Hata: {{ error }}</div>

    <template v-else-if="detail">
      <!-- TOP BAR -->
      <header class="topbar">
        <div class="topActions">
          <button class="backBtn" type="button" @click="goBack">
            ← Geri Dön
          </button>
        </div>
        <div class="breadcrumbs">
          <span>Otomobil</span>
          <span class="dot">•</span>
          <span>{{ detail.location.cityName }}</span>
          <span class="dot">•</span>
          <span>{{ detail.location.townName }}</span>
        </div>

        <h1 class="title">{{ detail.title }}</h1>

        <div class="metaPills">
          <span class="pill">İlan No: {{ detail.id }}</span>
          <span class="pill">{{ detail.dateFormatted }}</span>
          <span class="pill">{{ detail.modelName }}</span>
        </div>
      </header>

      <div class="detailLayout">
        <!-- LEFT -->
        <main class="detailLeft">
          <!-- HERO IMAGE -->
          <div class="hero" v-if="photos.length" @click="openLightbox(0)" role="button">
            <img class="heroImg" :src="photos[0]" alt="Araç fotoğrafı" />
            <div class="heroBadge">{{ photos.length }} Foto</div>
          </div>

          <!-- SLIDER (thumbs only) -->
          <div v-if="photos.length" class="sliderWrap">
            <Swiper
                :modules="swiperModules"
                :slides-per-view="5"
                :space-between="10"
                :navigation="true"
                class="thumbs"
                :breakpoints="{
                0: { slidesPerView: 3 },
                640: { slidesPerView: 4 },
                1024: { slidesPerView: 6 }
              }"
            >
              <SwiperSlide v-for="(url, idx) in photos" :key="url + idx">
                <button class="thumbBtn" type="button" @click="openLightbox(idx)">
                  <img class="thumbImg" :src="url" alt="thumb" />
                </button>
              </SwiperSlide>
            </Swiper>
          </div>

          <!-- Fullscreen -->
          <vue-easy-lightbox
              :visible="lightbox.visible"
              :imgs="photos"
              :index="lightbox.index"
              @hide="lightbox.visible = false"
          />

          <!-- DETAILS CARDS -->
          <section class="card">
            <h2 class="cardTitle">Öne Çıkanlar</h2>

            <div class="highlights">
              <div class="hItem">
                <div class="k">Model Yılı</div>
                <div class="v">{{ year || "-" }}</div>
              </div>

              <div class="hItem">
                <div class="k">Kilometre</div>
                <div class="v">{{ km ? `${km} km` : "-" }}</div>
              </div>

              <div class="hItem">
                <div class="k">Vites</div>
                <div class="v">{{ gear || "-" }}</div>
              </div>

              <div class="hItem">
                <div class="k">Yakıt</div>
                <div class="v">{{ fuel || "-" }}</div>
              </div>
            </div>
          </section>

          <section class="card">
            <h2 class="cardTitle">Tüm Özellikler</h2>

            <div class="props">
              <div v-for="p in detail.properties" :key="p.name" class="propRow">
                <span class="k">{{ propLabel(p.name) }}</span>
                <span class="v">{{ p.value || "-" }}</span>
              </div>
            </div>
          </section>

          <section class="card">
            <h2 class="cardTitle">Açıklama</h2>
            <div class="desc" v-html="detail.text"></div>
          </section>
        </main>

        <!-- RIGHT -->
        <aside class="detailRight">
          <div class="sideCard">
            <div class="priceBox">
              <div class="price">{{ detail.priceFormatted }}</div>
              <div class="sub">
                Konum: {{ detail.location.cityName }} / {{ detail.location.townName }}
              </div>
            </div>

            <div class="seller">
              <div class="sellerName">{{ detail.userInfo.nameSurname }}</div>
              <div class="sellerPhone">{{ detail.userInfo.phoneFormatted }}</div>

              <div class="actions">

                <button class="btn" type="button" @click="openWhatsapp">
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </div>

          <div class="sideCard subtle">
            <div class="warnTitle">Güvenlik</div>
            <div class="warnText">
              Kapora göndermeden önce ilan sahibini doğrulayın. Şüpheli durumda işlem yapmayın.
            </div>
          </div>
        </aside>
      </div>
    </template>


  </section>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import { useQuery } from "@tanstack/vue-query";

import { getDetail } from "@/core/api/adverts.service";
import type { AdvertDetail } from "@/core/models/advert";
import { formatPhotoUrl, getProp, uniq } from "@/core/utils/advert";

// Swiper
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Lightbox
import VueEasyLightbox from "vue-easy-lightbox";

const route = useRoute();
const router = useRouter();

const id = computed(() => String(route.params.id || ""));

const swiperModules = [Navigation];

const lightbox = reactive({
  visible: false,
  index: 0,
});

function openLightbox(index: number) {
  lightbox.index = index;
  lightbox.visible = true;
}


const detailQuery = useQuery<AdvertDetail>({
  queryKey: computed(() => ["adverts", "detail", id.value]),
  queryFn: () => getDetail(id.value),
  enabled: computed(() => !!id.value),
  keepPreviousData: true,
});

const detail = computed(() => detailQuery.data.value ?? null);
const loading = computed(() => detailQuery.isFetching.value);
const error = computed(() => (detailQuery.error.value as any)?.message ?? null);

// shortcuts
const km = computed(() => getProp(detail.value, "km"));
const year = computed(() => getProp(detail.value, "year"));
const gear = computed(() => getProp(detail.value, "gear"));
const fuel = computed(() => getProp(detail.value, "fuel"));

const photos = computed(() => {
  const arr = detail.value?.photos ?? [];
  const sized = arr.map((u) => formatPhotoUrl(u, "800x600"));
  return uniq(sized);
});

function propLabel(name: string) {
  const map: Record<string, string> = {
    km: "Kilometre",
    year: "Model Yılı",
    fuel: "Yakıt",
    gear: "Vites",
    color: "Renk",
  };
  return map[name] || name;
}

const rawPhone = computed(() => {
  const p = detail.value?.userInfo?.phoneFormatted || detail.value?.userInfo?.phone || "";
  return String(p);
});

const phoneDigits = computed(() => rawPhone.value.replace(/[^\d]/g, ""));


const whatsappPhone = computed(() => {
  const d = phoneDigits.value;
  if (!d) return "";
  if (d.startsWith("90")) return d;
  if (d.startsWith("0")) return `90${d.slice(1)}`;

  if (d.length === 10) return `90${d}`;
  return d;
});

const telHref = computed(() => {
  const d = phoneDigits.value;
  if (!d) return "";
  return `tel:${d}`;
});

function goBack() {

  if (window.history.length > 1) router.back();
  else router.push("/");
}

function openWhatsapp() {
  const phone = whatsappPhone.value;
  if (!phone) return;

  const text = encodeURIComponent(`Merhaba, ilan #${detail.value?.id} için yazıyorum.`);
  const url = `https://wa.me/${phone}?text=${text}`;

  window.open(url, "_blank", "noopener,noreferrer");
}



</script>

