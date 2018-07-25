function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}










function init() {
    $(".image-checkbox").each(function () {
        if ($(this).find('input[type="checkbox"]').first().attr("checked")) {
            $(this).addClass('image-checkbox-checked');
        }
        else {
            $(this).removeClass('image-checkbox-checked');
        }
    });

    // sync the state to the input
    $(".image-checkbox").on("click", function (e) {
        $(this).toggleClass('image-checkbox-checked');
        var $checkbox = $(this).find('input[type="checkbox"]');
        $checkbox.prop("checked", !$checkbox.prop("checked"))
        e.preventDefault();


        var src = $(this).attr('src');
        var img = '<img src="' + src + '" class="img-responsive"/>';

        //start of new code new code
        var index = $(this).parent('div').index();

        var html = '';
        html += img;
        html += '<div style="height:25px;clear:both;display:block;">';
        html += '<a class="controls next" href="' + (index + 2) + '">next &raquo;</a>';
        html += '<a class="controls previous" href="' + (index) + '">&laquo; prev</a>';
        html += '</div>';

        $('#myModal').modal();
        $('#myModal').on('shown.bs.modal', function () {
            $('#myModal .modal-body').html(html);
            //new code
            $('a.controls').trigger('click');
        })
        $('#myModal').on('hidden.bs.modal', function () {
            $('#myModal .modal-body').html('');
        });

    });


    $(".image-checkbox").on('dblclick', function () {
        var src = $(this).attr('src');
        var img = '<img src="' + src + '" class="img-responsive"/>';

        //start of new code new code
        var index = $(this).parent('div').index();

        var html = '';
        html += img;
        html += '<div style="height:25px;clear:both;display:block;">';
        html += '<a class="controls next" href="' + (index + 2) + '">next &raquo;</a>';
        html += '<a class="controls previous" href="' + (index) + '">&laquo; prev</a>';
        html += '</div>';

        $('#myModal').modal();
        $('#myModal').on('shown.bs.modal', function () {
            $('#myModal .modal-body').html(html);
            //new code
            $('a.controls').trigger('click');
        })
        $('#myModal').on('hidden.bs.modal', function () {
            $('#myModal .modal-body').html('');
        });
    });




    $(document).ready(function () {
        $('div img').on('doubleclick', function () {
            var src = $(this).attr('src');
            var img = '<img src="' + src + '" class="img-responsive"/>';

            //start of new code new code
            var index = $(this).parent('div').index();

            var html = '';
            html += img;
            html += '<div style="height:25px;clear:both;display:block;">';
            html += '<a class="controls next" href="' + (index + 2) + '">next &raquo;</a>';
            html += '<a class="controls previous" href="' + (index) + '">&laquo; prev</a>';
            html += '</div>';

            $('#myModal').modal();
            $('#myModal').on('shown.bs.modal', function () {
                $('#myModal .modal-body').html(html);
                //new code
                $('a.controls').trigger('click');
            })
            $('#myModal').on('hidden.bs.modal', function () {
                $('#myModal .modal-body').html('');
            });
        });
    })


    $(document).on('click', 'a.controls', function () {
        var index = $(this).attr('href');
        var src = $('div.row div:nth-child(' + index + ') img').attr('src');

        $('.modal-body img').attr('src', src);

        var newPrevIndex = parseInt(index) - 1;
        var newNextIndex = parseInt(newPrevIndex) + 2;

        if ($(this).hasClass('previous')) {
            $(this).attr('href', newPrevIndex);
            $('a.next').attr('href', newNextIndex);
        } else {
            $(this).attr('href', newNextIndex);
            $('a.previous').attr('href', newPrevIndex);
        }

        var total = $('div.row div').length + 1;
        //hide next button
        if (total === newNextIndex) {
            $('a.next').hide();
        } else {
            $('a.next').show()
        }
        //hide previous button
        if (newPrevIndex === 0) {
            $('a.previous').hide();
        } else {
            $('a.previous').show()
        }


        return false;
    });


}


