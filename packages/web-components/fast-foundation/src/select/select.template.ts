import { html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { AnchoredRegion } from "../anchored-region";
import { Listbox } from "../listbox/listbox";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { ElementDefinitionContext } from "../design-system";
import type { Select, SelectOptions } from "./select";

/**
 * The template for the {@link @microsoft/fast-foundation#(Select:class)} component.
 * @public
 */
export const selectTemplate: (
    context: ElementDefinitionContext,
    definition: SelectOptions
) => ViewTemplate<Select> = (
    context: ElementDefinitionContext,
    definition: SelectOptions
) => html`
    <template
        class="${x => (x.open ? "open" : "")} ${x =>
            x.disabled ? "disabled" : ""} ${x => x.position}"
        role="${x => x.role}"
        tabindex="${x => (!x.disabled ? "0" : null)}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-expanded="${x => x.ariaExpanded}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @focusout="${(x, c) => x.focusoutHandler(c.event as FocusEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    >
        <div
            aria-activedescendant="${x => (x.open ? x.ariaActiveDescendant : null)}"
            aria-controls="listbox"
            aria-expanded="${x => x.ariaExpanded}"
            aria-haspopup="listbox"
            class="control"
            part="control"
            role="button"
            ?disabled="${x => x.disabled}"
        >
            ${startSlotTemplate(context, definition)}
            <slot name="button-container">
                <div class="selected-value" part="selected-value">
                    <slot name="selected-value">${x => x.displayValue}</slot>
                </div>
                <div class="indicator" part="indicator">
                    <slot name="indicator">
                        ${definition.indicator || ""}
                    </slot>
                </div>
            </slot>
            ${endSlotTemplate(context, definition)}
        </div>
        ${when(
            x => x.open,
            html<Select>`
                <${context.tagFor(AnchoredRegion)}
                class="region"
                auto-update-mode="auto"
                fixed-placement="true"
                vertical-positioning-mode="locktodefault"
                vertical-default-position="bottom"
                vertical-scaling="content"
                vertical-inset="false"
                horizontal-positioning-mode="locktodefault"
                horizontal-default-position="right"
                horizontal-scaling="anchor"
                horizontal-inset="true"
                ${ref("region")}
            >
        <div
            aria-disabled="${x => x.disabled}"
            class="listbox"
            id="listbox"
            part="listbox"
            role="listbox"
            ?disabled="${x => x.disabled}"
            ?hidden="${x => !x.open}"
            ${ref("listbox")}
        >
            <slot
                ${slotted({
                    filter: Listbox.slottedOptionFilter,
                    flatten: true,
                    property: "slottedOptions",
                })}
            ></slot>
        </div>
        </${context.tagFor(AnchoredRegion)}>
        `
        )}
    </template>
`;
