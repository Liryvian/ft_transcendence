<!-- FILE LATER TO BE REMOVED -->

<template>
    <div class="page_box_wrapper">
        <div class="page_box">

            <h1>Some Elements to reuse</h1>

            <!-- Without pb_bottom it's positioned on the top -->
            <div class="page_button pb_bottom">
                <a href="#">save</a>
            </div>

            <div class="form_group">
                <div class="field_group">
                    <label for="">field label:</label>
                    <input type="text" value="disabled field" disabled>
                </div>

                <div class="field_group">
                    <label for="">field label:</label>
                    <input type="text" placeholder="placeholder text (optional)">
                </div>
            </div>

            <div class="c_media">
                <div class="c_media__asset c_asset__circle">
                    <img src="/test-profile.png" alt="">
                </div>
                <div class="c_media__content">
                    some piece of text
                </div>
            </div>

        </div>
    </div>
</template>