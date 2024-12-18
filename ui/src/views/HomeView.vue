<script setup lang="ts">
import Button from '@/components/Button.vue';
import ArrowOutIcon from '@/components/icons/ArrowOutIcon.vue';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { Project } from '@/types';

import { allProjects } from '@/scripts/data';
import { onMounted, ref } from 'vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';

const modules = [Navigation, Pagination];

const projects = ref<Project[]>([]);

onMounted(async () => {
  projects.value = await allProjects();
});
</script>

<template>
  <section>
    <div class="app_width">
      <div class="hero">
        <div class="hero_text">
          <h3>Empowering Change makers. Reducing Emissions.</h3>
          <p>A marketplace connecting climate innovators with industries to transform environmental challenges into
            impactful solutions for society.</p>

          <RouterLink to="/login"><Button :text="'Get Started'" /></RouterLink>

          <div class="gradient"></div>
        </div>

        <div class="hero_image">
          <img src="../assets/images/leafs_image.png" alt="">
          <RouterLink to="/submission">
            <div>
              <img src="../assets/images/hero_image.png" alt="">
              <p>Become a Global Changemaker</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="icon">
            <ArrowOutIcon />
          </div>
          <h3>500 +</h3>
          <p>Eco-friendly projects</p>
        </div>

        <div class="stat">
          <div class="icon">
            <ArrowOutIcon />
          </div>
          <h3>10,000 +</h3>
          <p>Plastics Repurposed</p>
        </div>

        <div class="stat">
          <div class="icon">
            <ArrowOutIcon />
          </div>
          <h3>1 Million kg</h3>
          <p>CO2 Offset</p>
        </div>

        <div class="stat">
          <div class="icon">
            <ArrowOutIcon />
          </div>
          <h3>$5 million</h3>
          <p>Raised for Climate Solutions</p>
        </div>
      </div>

      <div class="discovers">
        <div class="discover">
          <p>Connect with industries dedicated to reducing waste and emissions—and secure funding for your innovations.
          </p>
          <RouterLink to="/projects">
            <button>
              <p>DISCOVER PROJECTS</p>
              <ArrowRightIcon />
            </button>
          </RouterLink>
        </div>

        <div class="discover">
          <p>Trade waste with industries for valuable resources that power innovations and build a sustainable future.
          </p>
          <RouterLink to="/marketplace">
            <button>
              <p>DISCOVER MARKET PLACE</p>
              <ArrowRightIcon />
            </button>
          </RouterLink>
        </div>

        <div class="discover">
          <p>Connect with industries dedicated to reducing waste and emissions—and secure funding for your innovations.
          </p>
          <RouterLink to="/leaderboard">
            <button>
              <p>DISCOVER LEADERBOARD</p>
              <ArrowRightIcon />
            </button>
          </RouterLink>
        </div>
      </div>

      <div class="news">
        <div class="news_title">
          <div></div>
          <p>RECENT PROJECTS</p>
        </div>

        <div class="news_detail">
          <div class="news_projects">
            <h3>Join EcoFusion Recent Fundraising Events</h3>

            <p v-if="projects.length == 0">No projects!</p>

            <div class="news_project" v-for="project in projects.slice(0, 3)" :key="project.id">
              <img :src="project.image" :alt="project.name">
              <div class="news_project_text">
                <h3>{{ Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }).format(project.date) }}</h3>
                <p>Creation of litter pickers out of single used facemasks</p>
                <RouterLink :to="`/donations/${project.id}`">
                  <Button :text="'Donate Now'" />
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="inspire">
            <div>
              <img src="../assets/images/inspire_image.png" alt="">
              <p>Create, Inspire, Sustain</p>
            </div>
          </div>
        </div>
      </div>

      <div class="testimonies">
        <div class="testimony_title">
          <p>What people say about us</p>
        </div>

        <Swiper :modules="modules" :slides-per-view="3.2" :space-between="30" navigation>
          <SwiperSlide>
            <div class="testimony">
              <p class="text">We repurposed industrial soot into sustainable ink, thanks to the changemakers we met
                here!
              </p>
              <div class="user">
                <img src="../assets/images/testimony_image_1.png" alt="">
                <div class="user_name">
                  <p>Alexander</p>
                  <p>Los Angeles</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="testimony">
              <p class="text">I can see the impact of my donations in real-time. It’s fulfilling to know I’m making a
                difference!
              </p>
              <div class="user">
                <img src="../assets/images/testimony_image_2.png" alt="">
                <div class="user_name">
                  <p>Emily</p>
                  <p>California</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="testimony">
              <p class="text">This platform helped me turn
                plastic waste into building
                materials and reach thousands.
                Incredible support. </p>
              <div class="user">
                <img src="../assets/images/testimony_image_3.png" alt="">
                <div class="user_name">
                  <p>Cheng</p>
                  <p>China</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="testimony">
              <p class="text">Our small recycling project gained global visibility and funding to expand. Amazing
                opportunities. </p>
              <div class="user">
                <img src="../assets/images/testimony_image_4.png" alt="">
                <div class="user_name">
                  <p>Rebecca</p>
                  <p>Ghana</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div class="footer">

      </div>
    </div>
  </section>
</template>


<style scoped>
.hero {
  display: grid;
  align-items: flex-end;
  grid-template-columns: 515px 1fr;
  margin-top: 60px;
}

.hero_text {
  position: relative;
}

.hero_text h3 {
  color: var(--tx-normal);
  font-size: 48px;
  font-weight: 700;
}

.hero_text p {
  color: var(--tx-normal);
  font-size: 22px;
  font-weight: 600;
  margin: 40px 0;
}

.hero_text .gradient {
  position: absolute;
  width: 40px;
  border-radius: 50px;
  box-shadow: 0 0 50px 35px rgba(103, 255, 0, 0.2);
  bottom: 0;
  left: 0;
}

.hero_image {
  display: flex;
  justify-content: flex-end;
  position: relative;
}

.hero_image>img {
  position: absolute;
  width: 376px;
  height: 550px;
  object-fit: cover;
  border-radius: 300px;
  right: 350px;
  bottom: 0;
  box-shadow: 0 0 150px 120px rgba(193, 237, 205, 0.1);
}

.hero_image div {
  width: 350px;
  height: 335px;
  border-radius: 351px;
  border: 1px solid #34443A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  overflow: hidden;
  gap: 20px;
}

.hero_image div img {
  border-radius: 36px;
  width: 106px;
  height: 132px;
  object-fit: cover;
}

.hero_image p {
  color: var(--tx-normal);
  font-size: 22px;
  font-weight: 500;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-top: 140px;
}

.stat {
  width: 262px;
  border-radius: 8px;
  border: 1px solid #34443A;
  background: #0E1F14;
  min-height: 200px;
  padding: 16px;
  cursor: pointer;
}

.stat:hover {
  border: 1px solid var(--primary);
}

.stat .icon {
  display: flex;
  justify-content: flex-end;
}

.stat h3 {
  color: var(--primary);
  font-size: 36px;
  font-weight: 500;
}

.stat p {
  color: var(--tx-dimmed);
  font-size: 18px;
  font-weight: 500;
  margin-top: 6px;
}

.discovers {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-top: 220px;
}

.discover {
  border-radius: 8px;
  border: 1px solid #3E614B;
  background: #0E1F14;
  padding: 30px;
  width: 386px;
  height: 608px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;
  text-align: center;
}

.discover:hover {
  border: 1px solid var(--primary);
}


.discover>p {
  color: var(--tx-normal);
  font-size: 24px;
  font-weight: 500;
}

.discover a {
  width: 100%;
}

.discover button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 50px;
  border-radius: 15px;
  background: #114117;
  box-shadow: 0px 4px 4px 0px rgba(17, 32, 22, 0.25);
  border: none;
}

.discover button p {
  color: var(--tx-dimmed);
  font-size: 18px;
  font-weight: 500;
}

.news {
  margin-top: 220px;
}

.news_title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.news_title p {
  color: var(--tx-normal);
  font-size: 18px;
  font-weight: 500;
}

.news_title div {
  width: 61px;
  height: 15px;
  background: #D9D9D9;
  box-shadow: 0 0 50px 35px rgba(103, 255, 0, 0.2);
  bottom: 0;
  left: 0;
}

.news_detail {
  display: grid;
  grid-template-columns: 1fr 558px;
  align-items: center;
  gap: 140px;
  margin-top: 50px;
}

.news_projects h3 {
  color: var(--tx-normal);
  font-size: 32px;
  font-weight: 500;
  text-transform: capitalize;
}

.news_projects>p {
  color: var(--tx-dimmed);
  font-size: 18px;
  font-weight: 500;
  margin-top: 20px;
}

.news_project {
  width: 638px;
  height: 240px;
  border-radius: 8px;
  background: #0E1F14;
  display: grid;
  grid-template-columns: 286px 1fr;
  overflow: hidden;
  margin-top: 20px;
}

.news_project img {
  width: 286px;
  height: 240px;
  object-fit: cover;
}

.news_project_text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.news_project_text h3 {
  color: var(--tx-dimmed);
  font-size: 20px;
  font-weight: 500;
}

.news_project_text p {
  color: #ABB0A8;
  font-size: 18px;
  font-weight: 500;
}

.news_project_text button {
  width: fit-content;
}

.inspire div {
  width: 558px;
  height: 510px;
  position: relative;
}

.inspire div p {
  color: var(--tx-normal);
  font-size: 32px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(39, 81, 10, 1);
  border-radius: 50px;
  text-wrap: nowrap;
  padding: 10px 16px;
}

.testimonies {
  margin-top: 160px;
}

.testimony_title p {
  color: #FFF;
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 40px;
}

.testimony {
  width: 398px;
  border-radius: 15px;
  background: #061B0E;
  padding: 30px;
  cursor: pointer;
}

.testimony .text {
  color: #ABB0A8;
  font-size: 20px;
  font-weight: 500;
  min-height: 140px;
}

.testimony .user {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 30px;
}

.testimony img {
  width: 100px;
  height: 100px;
}

.testimony .user_name p:first-child {
  color: #F8F8F8;
  font-size: 24px;
  font-weight: 500;
}

.testimony .user_name p:last-child {
  color: #5AA427;
  font-size: 24px;
  font-weight: 500;
}
</style>