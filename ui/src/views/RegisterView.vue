<script setup lang="ts">
import Button from '@/components/Button.vue';
import UploadIcon from '@/components/icons/UploadIcon.vue';
import { newAccount } from '@/scripts/data';
import { registerAsArtisan, registerAsFirm } from '@/scripts/hedera';
import Storage from '@/scripts/storage';
import { useWalletConnect } from '@/scripts/wallet-connect-client';
import { useToast } from 'vue-toast-notification';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AccountType } from '@/types';

const walletConnect = useWalletConnect();
const toast = useToast({ duration: 4000, position: "top" });

const router = useRouter();

const form = ref({
    name: '',
    description: '',
    type: AccountType.Individual,
    address: '',
    donationMax: 0,
    image: undefined as File | undefined,
    attachment: undefined as File | undefined,
});
const submitting = ref(false);

const onTypeChange = (event: any) => {
    const value = event.target?.value;
    if (value) {
        form.value.type = event.target?.value;
    }
};

const onFileChange = (event: any) => {
    const files = event.target?.files;
    if (files && files.length > 0) {
        form.value.image = event.target?.files[0];
    }
};

const onAttachmentChange = (event: any) => {
    const files = event.target?.files;
    if (files && files.length > 0) {
        form.value.attachment = event.target?.files[0];
    }
};

const register = async () => {
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

    if (form.value.image == undefined) {
        toast.error('Project image is required');
        return;
    }

    submitting.value = true;

    const hash = form.value.type == AccountType.Individual ?
        await registerAsArtisan({ name: form.value.name }) :
        await registerAsFirm({ name: form.value.name });

    const imageUrl = await Storage.awaitUpload(form.value.image, form.value.name);
    if (imageUrl == '') {
        toast.error('Failed to upload image');
        submitting.value = false;
        return;
    }

    let attachmentUrl = '';
    if (form.value.attachment) {
        attachmentUrl = await Storage.awaitUpload(form.value.attachment, `attachment_${form.value.name}`);
        if (attachmentUrl == '') {
            toast.error('Failed to upload attachment');
            submitting.value = false;
            return;
        }
    }

    if (hash) {
        await newAccount({
            name: form.value.name,
            description: form.value.description,
            type: form.value.type,
            image: imageUrl,
            attachment: attachmentUrl,
            address: walletConnect.state.accountId
        });

        toast.success('Account created');

        form.value.name = '';
        form.value.description = '';
        form.value.image = undefined;
        form.value.attachment = undefined;

        router.push('/marketplace');
    } else {
        toast.error('Something went wrong');
    }

    submitting.value = false;
};
</script>

<template>
    <section>
        <div class="app_width">
            <div class="register">
                <div class="register_title">
                    <h3>Create an account</h3>
                    <p>Get started with EcoFusion today!</p>
                </div>

                <div class="form">
                    <div class="input">
                        <label>Name *</label>
                        <input type="text" v-model="form.name">
                    </div>

                    <div class="input_split">
                        <div class="input">
                            <label>About *</label>
                            <textarea rows="10" type="text" v-model="form.description"></textarea>
                        </div>

                        <div class="input">
                            <label>Profile image *</label>
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
                        <label>Account type *</label>
                        <select @change="onTypeChange">
                            <option :value="AccountType.Individual">Individual</option>
                            <option :value="AccountType.Company">Company</option>
                        </select>
                    </div>

                    <div class="input">
                        <label>Attachments *</label>
                        <div class="file">
                            <div>
                                <UploadIcon />
                                <p v-if="!form.attachment">Drag and Drop files here or Browse files</p>
                                <p v-else>{{ form.attachment.name }}</p>
                            </div>
                            <input type="file" accept="*" @change="onAttachmentChange">
                        </div>
                    </div>
                </div>

                <Button :loading="submitting" :text="'Register'" @click="register" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.register {
    padding-top: 20px;
}

.register_title {
    text-align: center;
}

.register_title h3 {
    color: #ACDCBD;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
}

.register_title p {
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