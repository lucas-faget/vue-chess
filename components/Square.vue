<script setup lang="ts">
import type { VPiece } from "@/types";
import { useSettings } from "~/composables/useSettings";
const { getChessboardColor } = useSettings();

withDefaults(
    defineProps<{
        name?: string;
        piece: VPiece | null;
        isDark: boolean;
        isLegal?: boolean;
        isActive?: boolean;
        isChecked?: boolean;
    }>(),
    {
        isLegal: false,
        isActive: false,
        isChecked: false,
    }
);
</script>

<template>
    <div
        :class="[
            isDark
                ? isLegal
                    ? getChessboardColor().darkLegal
                    : isActive
                    ? getChessboardColor().darkActive
                    : isChecked
                    ? getChessboardColor().darkChecked
                    : getChessboardColor().dark
                : isLegal
                ? getChessboardColor().lightLegal
                : isActive
                ? getChessboardColor().lightActive
                : isChecked
                ? getChessboardColor().lightChecked
                : getChessboardColor().light,
        ]"
    >
        <img
            v-if="piece !== null"
            class="h-full w-full aspect-square"
            :src="getPieceImage(piece.color, piece.name)"
            :alt="piece.name"
        />
    </div>
</template>
