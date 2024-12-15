<script setup lang="ts">
import Button from '@/components/Button.vue';
import UploadIcon from '@/components/icons/UploadIcon.vue';
import { allCategories, newProject } from '@/scripts/data';
import { registerAProject } from '@/scripts/hedera';
import Storage from '@/scripts/storage';
import { useWalletConnect } from '@/scripts/wallet-connect-client';
import { useToast } from 'vue-toast-notification';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const walletConnect = useWalletConnect();
const toast = useToast({ duration: 4000, position: "top" });

const form = ref({
    name: '',
    description: '',
    category: '',
    links: '',
    donationMax: 0,
    image: undefined as File | undefined
});
const submitting = ref(false);

const onCategoryChange = (event: any) => {
    const value = event.target?.value;
    if (value) {
        form.value.category = event.target?.value;
    }
};

const onFileChange = (event: any) => {
    const files = event.target?.files;
    if (files && files.length > 0) {
        form.value.image = event.target?.files[0];
    }
};

const submit = async () => {
    if (walletConnect.state.accountId == '') {
        toast.error('Please connect your wallet');
        return;
    }

    if (form.value.name == '') {
        toast.error('Project name is required');
        return;
    }

    if (form.value.description == '') {
        toast.error('Project description is required');
        return;
    }
    if (form.value.category == '') {
        toast.error('Project category is required');
        return;
    }

    if (form.value.image == undefined) {
        toast.error('Project image is required');
        return;
    }

    if (form.value.donationMax == 0) {
        toast.error('Project target goal is required');
        return;
    }

    submitting.value = true;

    const projectId = Math.floor(Math.random() * 1_000_000_000) + 1;

    const hash = await registerAProject(
        projectId,
        form.value.donationMax,
        { name: form.value.name }
    );

    const imageUrl = await Storage.awaitUpload(form.value.image, form.value.name);
    if (imageUrl == '') {
        toast.error('Failed to upload image');
        submitting.value = false;
        return;
    }

    if (hash) {
        await newProject({
            name: form.value.name,
            description: form.value.description,
            category: form.value.category,
            links: form.value.links.split(','),
            image: imageUrl,
            raised: 0,
            goal: form.value.donationMax,
            owner: walletConnect.state.accountId,
            id: projectId,
            date: new Date(Date.now())
        });

        toast.success('Project created');

        form.value.name = '';
        form.value.description = '';
        form.value.category = '';
        form.value.links = '';
        form.value.donationMax = 0;
        form.value.image = undefined;

        router.push('/projects');
    } else {
        toast.error('Something went wrong');
    }

    submitting.value = false;
};
</script>

<template>
    <section>
        <div class="app_width">
            <div class="submission">
                <div class="submission_title">
                    <h3>Showcase Your Innovation</h3>
                    <p>Share your solutions with the world and attract investors or collaborators</p>
                </div>

                <div class="form">
                    <div class="input">
                        <label>Project name *</label>
                        <input type="text" v-model="form.name">
                    </div>

                    <div class="input_split">
                        <div class="input">
                            <label>Description *</label>
                            <textarea rows="10" type="text" v-model="form.description"></textarea>
                        </div>

                        <div class="input">
                            <label>Image *</label>
                            <div class="file">
                                <div>
                                    <UploadIcon />
                                    <p v-if="!form.image">Drag and Drop files here or Browse files</p>
                                    <p v-else>{{ form.image.name }}</p>
                                </div>
                                <input type="file" accept="image/*" @change="onFileChange">
                            </div>
                        </div>
                    </div>

                    <div class=" input">
                        <label>Category *</label>
                        <select @change="onCategoryChange">
                            <option v-for="category in allCategories()" :value="category.id">{{ category.name }}
                            </option>
                        </select>
                    </div>

                    <div class="input">
                        <label>Target goal (Hbar) *</label>
                        <input type="number" v-model="form.donationMax">
                    </div>

                    <div class="input">
                        <label>Relevant links</label>
                        <input type="text" v-model="form.links">
                        <span>Seperated by comma.</span>
                    </div>
                </div>

                <Button :loading="submitting" :text="'Submit Project'" @click="submit" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.submission {
    padding-top: 20px;
}

.submission_title {
    text-align: center;
}

.submission_title h3 {
    color: #ACDCBD;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
}

.submission_title p {
    color: #FFF;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
}

.input_split {
    display: grid;
    grid-template-columns: repeat(2, 500px);
    gap: 40px;
}

.form label {
    color: #FFF;
    font-size: 18px;
    font-weight: 500;
    margin-top: 30px;
}

.form {
    margin-bottom: 30px;
}

.input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input,
select {
    border-radius: 15px;
    border: 1px solid #31513E;
    background: rgba(4, 38, 16, 0.23);
    width: 750px;
    max-width: 100%;
    height: 68px;
    outline: none;
    color: #FFF;
    font-size: 18px;
    font-weight: 500;
    padding: 0 20px;
}

option {
    color: #000;
}

.input span {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.file {
    border-radius: 15px;
    border: 1px solid #31513E;
    background: rgba(4, 38, 16, 0.23);
    height: 150px;
    position: relative;
}

.file div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    cursor: pointer;
}

.file p {
    color: #FFF;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
}

input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 2;
    opacity: 0;
}

textarea {
    border-radius: 15px;
    border: 1px solid #31513E;
    background: rgba(4, 38, 16, 0.23);
    resize: none;
    outline: none;
    color: var(--tx-normal);
    font-size: 18px;
    font-weight: 500;
    padding: 20px;
}
</style>