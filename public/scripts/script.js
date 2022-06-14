// Current Date Variable
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var todayDate = new Date();

const dateFormat = {
  day: "numeric",
  month: "numeric",
  year: "numeric"
}
var currentDate = todayDate.toLocaleDateString("en-uk", dateFormat);
var currentMonth = month[todayDate.getMonth()]
var noMonth = todayDate.getMonth() + 1

var currentYear = todayDate.getFullYear()

// Set first location on Diary

$(".currentMonth").html(currentMonth + " " + todayDate.getFullYear())

var firstDate = new Date(todayDate.getFullYear(), todayDate.getMonth());
var landedFirst = firstDate.getDay() + 1;

var daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0).getDate();

// Calculations
$(document).on("change", "#end_date", function() {
  if ($(".timeScale").val() == "FullDay") {
    let endDateCalc = new Date($(this).val()).getTime()
    let startDateCalc = new Date($(this).parent().parent().children().children("#start_date").val()).getTime()
    let calcTotal1 = endDateCalc - startDateCalc
    let calcTotal2 = calcTotal1 / (1000 * 3600 * 24) + 1;
    $(this).parent().parent().children().children("#total").val(calcTotal2)
  } else {
    $(this).parent().parent().children().children("#total").val(0.5)
  }

})

// End
//back to current month/today
function today() {
  todayDate = new Date();
  addOneMonth(+0)
};
// END



// Next Month
function addOneMonth(date) {

  todayDate = new Date(todayDate.setMonth(todayDate.getMonth() + date));
  firstDate = new Date(todayDate.getFullYear(), todayDate.getMonth());
  landedFirst = firstDate.getDay() + 1;
  noMonth = todayDate.getMonth() + 1;
  currentMonth = month[todayDate.getMonth()]
  daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate()
  var currentYear = todayDate.getFullYear()
  var currentMonthNo = todayDate.getMonth() + 1
  $(".currentMonth").html(currentMonth + " " + todayDate.getFullYear())
  let firstDay = firstDate.toISOString().substr(0,10)
  let lastDay = new Date(currentYear, currentMonthNo -1 , daysInMonth + 1).toISOString().substr(0,10)
  $(".item").remove()
  $(".first").remove()
  var i = 1
  for (i; i <= daysInMonth; i++) {
    if (i == 1) {
      $(".grid").append("<li class='first item' id ='" + currentYear + noMonth + i + "' data-datespan=" + currentYear + "-" + currentMonthNo + "-" + i + "><span class=dateNo>" + i + "</span></li>");
    } else {
      $(".grid").append("<li class='item' id ='" + currentYear + noMonth + i + "' data-datespan=" + currentYear + "-" + currentMonthNo + "-" + i + "><span class=dateNo>" + i + "</span></li>");
    }
    $(".first").css("grid-column-start", landedFirst)
  };
  itemMovement(firstDay,lastDay)
  $(".hide").hide()
};

function quickView(selected) {
$(".courseQV").remove()
  $(".quickViewDetails").children("li").show()
  $(".hadetails").remove()
  $(".qvOpen").show()
  let selectedHeaderId = $(selected).attr("data-headerid")
  let selectedBookingId = $(selected).attr("data-objid")

  $.get("/articles", function(data){
      var courseArray = []
    for(i = 0; i <= data.length-1;i++){
      let booking = data[i]
      if(booking._id == selectedHeaderId){
        let vortexRef = booking.VortexRef
        if(vortexRef == "Holiday" || vortexRef == "Appointment"){
          let note = booking.Notes[0].Note
          $(".qvHeader").text(vortexRef)
          $(".quickViewDetails").append('<div class="hadetails">'+vortexRef+' Details: '+note+'</div>')
          $(".quickViewDetails").children("li").hide()
          $(".quickViewDetails").children("li").eq(0).show()
          $(".quickViewDetails").children("li").eq(1).show()
          $(".qvOpen").hide()
        } else {
          $(".qvHeader").text(vortexRef).append("<span class='qvOrg'>   "+booking.Organisation+"</span>")
          $(".quickViewBooker").text(booking.BookerName + " - " + booking.BookerEmail)
        }

        for(t = 0; t<= booking.Bookings.length -1; t++){
          let specific = booking.Bookings[t]
          if(specific._id == selectedBookingId){

            $(".quickViewDates").text(new Date(specific.Start).toLocaleDateString("en-gb") + " - " + new Date(specific.End).toLocaleDateString("en-gb"))
            $(".quickViewTrainer").text(specific.Trainer)

            if(vortexRef == "Holiday" || vortexRef == "Appointment"){

            } else {

              for(e = 0; e <= specific.CourseInfo.length -1 ; e++){
                let courseInfo = specific.CourseInfo[e]
                if(this.TestingType == " NPORS Testing Type"){
                  let newCourse = "<li class='courseQV'>"+courseInfo.Course +" - "+ courseInfo.BookedDelegates+"</li>"
                  courseArray.push(newCourse)
                } else {
                  let newCourse = "<li class='courseQV'>"+courseInfo.Course+" - "+ courseInfo.TestingType +" - "+ courseInfo.BookedDelegates+"</li>"
                  courseArray.push(newCourse)
                }

              }

              $(".quickViewContact").text(specific.SiteContact + " - " + specific.SiteContactNumber)
              $(".quickViewLocation").text(specific.SiteLocation)
                $(".coursesLi").after(courseArray.toString().replaceAll(",",""))
            }
          }
        }
      }
    }
    if( i = data.length-1){
      $(".quickViewMenu").removeClass("hidden").addClass("quickViewOpen")
      let selectedHeaderId = $(selected).attr("data-headerid")
      let selectedBookingId = $(selected).attr("data-objid")
      let viewWidth = $(".quickViewMenu").width()
      let viewHeight = $(".quickViewMenu").height()
      let itemWidth = $(selected).parent(). width()
      $(".quickViewMenu").attr("data-headerid",selectedHeaderId).attr("data-objid",selectedBookingId )
      let left = $(selected).parent().offset().left - $(selected).parent().width()*1.5
      let top = $(selected).parent().offset().top
      let right = $(selected).parent().offset().left + $(selected).parent().width()
      let bottom = $(selected).parent().offset().bottom
      let locationCheck = $(".quickViewMenu").offset().left
      let bodyCheck = $(".bodyMain").offset().left
      if($(selected).parent().offset().left - viewWidth  > $(".bodyMain").offset().left){
        if(Number($(selected).parent().offset().top +viewHeight) > $(".flex-container").height()){
          $(".quickViewMenu").offset({top: bottom, left: left})
        } else {
          $(".quickViewMenu").offset({top: top, left: left})
        }
      } else {
        if(Number($(selected).parent().offset().top +viewHeight) > $(".flex-container").height()){
          $(".quickViewMenu").offset({bottom: top, left: right})
        } else {
          $(".quickViewMenu").offset({top: top, left: right})
        }

      }
      docUploadQuick()
    }
  })

}

$(document).on("click",".diaryItems", function(){
  quickView(this)
  // if(Number($(this).parent().offset().top +viewHeight) > $(".flex-container").height()){
  //   let difference =Number(viewHeight/2)
  //   $(".quickViewMenu").offset({top: top - difference, left: left})
  // }
 })


// fetch through //

function fetchReq(selectedId){
  var timeout = ""
  var timeoutTwo = ""
  if($(".matrixBody").css('display') == "none"){
    timeout = 0
    timeoutTwo = 400
  } else {
    timeout = 400
    timeoutTwo = 100
  }

  $(".quickViewMenu").removeClass("quickViewOpen").addClass("hidden")
  $(".sectionOneMid").children().remove()
  $(".matrixBookingSpecific").remove()
  $(".itemBooking").remove()
  $("#stageInvNo").val("").attr('data-originalno',"")
  $("#stageInvDate").val("").attr('data-originaldate',"")
  $("#stagePaidDate").val("").attr('data-originaldate',"")
setTimeout(function(){
  $(".matrixBody").delay(timeoutTwo).slideDown(400)
  $(".matrixBody").attr("data-headerid", selectedId)
  $.get("/articles", function(data) {
    $.each(data, function(i) {
      if(selectedId == this._id){

        $(".vortexRefMatrix").text(this.VortexRef)
        $(".vortexBookedBy").text('Booking created by: ' + this.CreatedBy)
        $("#orgNameMatrix").val(this.Organisation)
        $("#bookerNameMatrix").val(this.BookerName)
        $("#bookerEmailMatrix").val(this.BookerEmail)
        $(".invDetails").remove()
        $(".archiveLocation").text(this.ArchiveBoxNumber)
        $("#archiveInput").val(this.ArchiveBoxNumber)
        $.each(this.Bookings, function(i){

          let courseArr = []
          let totaldays = ""
          let dayRate = ""
          let cardType = this.CardsIncluded
          let delArr= []
          let delTotal = 0

          if(this.Delegates != undefined){
            delTotal = this.Delegates.length
            $.each(this.Delegates, function(){
              delArr.push('<li>'+this.FirstName+ "  "+ this.Surname +'</li>')
            })
          }
          $.each(this.CourseInfo, function(){
            totaldays = this.TotalDays
            dayRate = this.Rate
            if(this.TestingType == "NPORS Testing Type"){
              courseArr.push('<li>'+this.Course+'<li>')
            } else {
              courseArr.push('<li>'+this.Course+' - '+this.TestingType+'</li>')
            }
          })

          $("#stagePaperwork").val($(this.Paperwork).last()[0].Stage).attr('data-originalStage',$(this.Paperwork).last()[0].Stage)
          $("#stageRegister").val($(this.Register).last()[0].Stage).attr('data-originalStage',$(this.Register).last()[0].Stage)
          $("#stageCards").val($(this.Cards).last()[0].Stage).attr('data-originalStage',$(this.Cards).last()[0].Stage)
          $("#stageCertificates").val($(this.Certs).last()[0].Stage).attr('data-originalStage',$(this.Certs).last()[0].Stage)
            $("#stageInvNo").val($(this.Invoice).last()[0].InvNo).attr('data-originalno',$(this.Invoice).last()[0].InvNo)
            $("#stageInvDate").val($(this.Invoice).last()[0].Date).attr('data-originaldate',$(this.Invoice).last()[0].Date )
            $("#stagePaidDate").val($(this.Paid).last()[0].Date).attr('data-originaldate',$(this.Paid).last()[0].Date)
          $(".matrixBookingDetails").append('<div class="matrixBookingSpecific"><li>Dates: '+new Date(this.Start).toLocaleDateString("EN-GB")+' - '+ new Date(this.End).toLocaleDateString("EN-GB") +'</li><li>Location: '+this.SiteLocation+'</li><li>Trainer: '+this.Trainer+'</li><li>Awarding Body: '+this.AwardingBody+' '+this.CardsIncluded+'</li><li>Courses: '+courseArr.toString().replaceAll(",","")+'</li></div>')
          let poRef = ""
          if(this.PONumber == "" || this.PONumber == undefined || this.PONumber == null){
            poRef = "Not Provided"
          } else {
            poRef = this.PONumber
          }
          let invoiceDetails = "<tr class='invDetails'><td class='trainingSpecs'>Training Booking: "  + courseArr.toString().replaceAll(",","") + '<li>'+new Date(this.Start).toLocaleDateString('en-gb')+'-'+new Date(this.End).toLocaleDateString('en-gb')+'</li>'+'<li>Location: '+this.SiteLocation+'</li>'+'<li> PO Number: '+poRef+'</li></td><td>'+this.TotalDays+'</td><td>'+this.Rate+'</td></tr><tr class="invDetails"><td class="cardsBooked">'+this.CardsIncluded+' accreditation for:'+ delArr.toString().replaceAll(",","")+'</td><td>'+delTotal+'</td><td>'+this.CardRate+'</td></tr>'
          $(".invoiceScroll").children("table").append(invoiceDetails)
          $(".bookingItemsBar").append('<div class="itemBooking" data-specificId="'+this._id+'"> Booking - '+Number(i + 1)+' </div>')
          $(".itemBooking").eq(0).addClass("clickedBooking")
        })
      }
    })
  })
  docUpload()
  notesUpdates()
},timeout)

}

$(document).on("click", " .specificMissing, .saveCourse, .foundItem, .qvOpen, .goToBooking", function fetchTest() {
  const width = $(".bodyMain").width()
  const height = $(".bodyMain").height()
  $(".vortalWindow").slideUp(400)
  $(".matrixDocs").removeClass("active")
  $(".matrixDocs").eq(0).addClass("active")
  $(".addNewDoc").attr("data-docupload", "Register")
  $(".pdfViewer").hide()
  $(".searchBox").animate({left: -640}, 400)
  $(".searchTextBox").val("")
  $(".searchTextBox").attr("type","text")
  ///////BookingOverlay///////
  $(".OverlayOne").animate({'right': '-70%'})
  $('.OverlayOne').removeClass("Open")
  //////DelegateOverlay///////
  $(".OverlayTwo").animate({'right': '-70%'})
  $('.OverlayTwo').removeClass("Open")
  $(".delegateImgTwo").css({'background-image': "url('/Images/vortalPortraitStandIn.png')"})
  $("#delegatePhotoChange")[0].reset()
  $(".delegateForm").trigger('reset')
  $(".delegateDetailsEdit").removeAttr("data-userid")
  /////ViewerOverlay////////
  $(".OverlayThree").animate({'right': '-65%'})
  $(".matrixViewer").attr("data", '').addClass("hidden")
  //////CandidateOverlay////////
  $(".overLayCandidate").animate({'right': '-70%'})
  $('.overLayCandidate').removeClass("Open")
  //////OrgOverlay//////
  $(".orgOverlay").animate({'right': '-70%'})
  $('.orgOverlay').removeClass("Open")
  //////CourseOverlay//////
  $(".courseOverlay").animate({'right': '-30%'})
  $('.courseOverlay').removeClass("Open")
  let selectedId = ''
  $(".vortalNavItem").each(function(){
    $(this).removeClass("active")
    if($(this).attr("data-navitem") == "Diary"){
      $(this).addClass("active")
    }
  })
  switch (true) {
    case $(this).hasClass("qvOpen"):selectedId =$(this).closest(".quickViewMenu").attr('data-headerid')

      break;
      case $(this).hasClass("goToBooking"):selectedId =$(this).closest(".candidateItem").attr('data-headerid')

        break;
    default:
      selectedId =$(this).attr('data-headerid')
  }

fetchReq(selectedId)
})

$(document).on("click",".clearNote", function(){
  $('#note').val('')
  $("#noteSeverity").val('Standard')
})

$(".sendNote").on("click", function(i) {
  $.ajaxSetup({
    async: false
  });

  let currentUser = $(".currentLoggedOn").attr('data-userfn')
  let newNote = $("#note").val()
  let currentJob = $(".matrixBody").attr("data-headerid")
  let severity = $("#noteSeverity").val()
  $.post("/newNote",

    {
      postReqCurrent: currentJob,
      postReqNote: newNote,
      postReqUser: currentUser,
      postReqSeverity: severity,
      postReqTimeStamp: new Date($.now()).toLocaleDateString("en-GB")
    },
    function(data, status) {
    }).done(function(){
      notesUpdates()
    })
})

  // GET END

//Function END//

$(document).on("click", ".closeMatrix", function() {
if($(".matrixScroll").find(".Updated").length > 0 || $(".matrixScroll").find(".New").length > 0 ){
  let confirmation = confirm("You are trying to leave this page with unsaved items. If you close this page now it will not save. Do you want to continue?")
  if(confirmation == true){
    $(".matrixBody").slideUp(400)
    $(".bodyMain").delay(400).slideDown(400)
    addOneMonth(0)
  }
} else {
  $(".matrixBody").slideUp(400)
  $(".bodyMain").delay(400).slideDown(400)
}
})


// New movement with fetch //
function itemMovement(firstDay, lastDay) {
  console.log(lastDay);
  $(".testBox").children().remove()
  var selectedItem = $(".floatingBox").attr("data-idobject")
  $.get("/articles", function(data) {
    for(w = 0; w <= data.length-1;w++){
      let dataB = data[w]
      let headerID = dataB._id
      let dataTitle = dataB.VortexRef
      let eachData = dataB.Bookings
      for(i = 0; i <= eachData.length - 1; i++){
        if(new Date(eachData[i].Start) >= new Date(firstDay) && new Date(eachData[i].Start) <= new Date(lastDay)){
        let dataA = eachData[i]
        let dataId = dataA._id
        let dataElLoc = dataA.el
        let dataStart = dataA.Start
        let dataEnd = dataA.End
        let dataTotal = dataA.TotalDays
        let trainerBefore = dataA.Trainer
        let stage = dataA.TrainerStage[dataA.TrainerStage.length - 1].Stage
        let dataTrainer = ""
        if(trainerBefore == "Tyler Noblett"){
          dataTrainer = "TYN"
        } else {
          dataTrainer = trainerBefore.split(" ")[0].toString().substring(0,1).toUpperCase()  + trainerBefore.split(" ")[1].toString().substring(0,1)
        }
        let weekLocandDays = Number(new Date(dataStart).getDay()) + Number(dataTotal)
        let differenceDate = weekLocandDays - 7
        let toSat = 7 - Number(new Date(dataStart).getDay())
        let afterWeekend = Number(toSat) + Number(dataElLoc)
        let lengthBefore = toSat
        let lengthAfter = Number(dataTotal) - Number(toSat)
        //start of script//
        if (weekLocandDays > 7) {
          let location = "#" + dataElLoc
          //////////////////////////////before Saturday //////////////////////////////
          $(location).children("span").after("<li class ='diaryItems firstItem widthx" + lengthBefore+ " "+stage + "' data-objid=" + dataId + " data-locsort=" + dataTotal + " data-headerId=" + headerID + " data-elloc=" + dataElLoc + ">" + dataTrainer + "-" + dataTitle + "</li>")
          for (i = 1; i <= lengthBefore - 1; i++) {
            let nextStart = Date.parse(dataStart)
            let dateNew = new Date(nextStart)
            let intDate = dateNew.setDate(dateNew.getDate() + i)
            let nextDay = new Date(intDate)
            let nextEnd = nextDay.toISOString().substr(0, 10)
            let next = nextEnd.replace("-0", "").replace("-0", "").replace("-", "").replace("-", "");
            //////////////////////////////creating the blanks on the additional days//////////////////////////////
            $("#" + next).children("span").after("<li class ='diaryItems "+stage+"' data-objid=" + dataId + " data-headerId=" + headerID + ">" + "&nbsp;" + "</li>")
          }
          //////////////////////////////after saturday //////////////////////////////
          $("#" + afterWeekend).children("span").after("<li class = 'diaryItems widthx" + lengthAfter+ " "+stage + "' data-objid=" + dataId + " data-headerId=" + headerID + ">" +  dataTrainer + "-" + dataTitle  + "</li>")
          for (i = 1; i <= lengthAfter-1; i++) {
            let nextStartAfter = Date.parse(dataStart)
            let dateNewAfter = new Date(nextStartAfter)
            let intDateAfter = dateNewAfter.setDate(dateNewAfter.getDate() + lengthBefore + i)
            let nextDayAfter = new Date(intDateAfter)
            let nextEndAfter = nextDayAfter.toISOString().substr(0, 10)
            let nextAfter = nextEndAfter.replace("-0", "").replace("-0", "").replace("-", "").replace("-", "")
            ////////////////////////////// creating blanks on the additional days//////////////////////////////
            $("#" + nextAfter).children("span").after("<li class ='diaryItems "+stage+"' data-objid=" + dataId + " data-headerId=" + headerID + ">" + "&nbsp;" + "</li>")
          }
        }
        else {
          let location = "#" + dataElLoc;
          if (dataA.TotalDays == "0.5") {
            $(location).children("span").after("<li class ='diaryItems firstItem width" + dataA.TimeScale + " "+stage+  "' data-objid=" + dataId + " data-locsort=" + dataTotal + " data-headerId=" + headerID + " data-elloc=" + dataElLoc + ">" + dataTrainer + "-" + dataTitle + "</li>")
          } else {
            $(location).children("span").after("<li class ='diaryItems firstItem widthx" + dataTotal+ " "+stage + "' data-objid=" + dataId + " data-locsort=" + dataTotal + " data-headerId=" + headerID + " data-elloc=" + dataElLoc + ">" + dataTrainer + "-" + dataTitle + "</li>")
          }
          if (Number(dataTotal) > 1) {

            for (i = 1; i <= dataTotal - 1; i++) {
              let nextStart = Date.parse(dataStart)
              let dateNew = new Date(nextStart)
              let intDate = dateNew.setDate(dateNew.getDate() + i)
              let nextDay = new Date(intDate)
              let nextEnd = nextDay.toISOString().substr(0, 10)
              let nextHalf = nextEnd.replace("-0", "").replace("-0", "").replace("-", "").replace("-", "")
              ////////////////////////////// creating blanks on the additional days//////////////////////////////
              $("#" + nextHalf).children("span").after("<li class ='diaryItems "+stage+"' data-objid=" + dataId + " data-locsort=" + dataTotal + " data-headerId=" + headerID + ">" + "&nbsp;"+ "</li>")
            }
          }
        }
      }
      }

    }
    // REVIEW: GET THIS SORTED THIS IS HALF DAY BOOKING //
    $(".item").each(function() {
      let child = $(this).children(".diaryItems")
      $.each(child, function() {
        if ($(this).hasClass("widthAM") || $(this).hasClass("widthPM")) {
          var pmTrainer = ""
          var pm = ""
          var amTrainer = ""
          var am = ""
          if ($(this).hasClass("widthAM")) {

            let name = $(this).text().split("-")
            amTrainer = name[2]
            am = $(this)
          }
          if ($(this).hasClass("widthAM")) {

            let name = $(this).text().split("-")
            pmTrainer = name[2]
            pm = $(this)

          }
          if (amTrainer == pmTrainer) {
            if ($(this).hasClass("widthPM")) {
              $(this).after(am);
            }
            $(this).before(am);
          }


        }

      })




      let amHeader = $(this).attr("data-headerid")
      let amId = $(this).attr("data-objid")
      let checkPM = $(this).parent().children(".widthPM")


    })
    let arrayObjId = []
    $(".diaryItems").each(function() {
      let thisAttr = $(this).attr("data-objid")
      let thisIndex = $(this).index()
      let nextParent = $(this).parent().next()
      let nextChildren = nextParent.children("li")
      if($.inArray(thisAttr, arrayObjId) == -1){
        arrayObjId.push(thisAttr);
      }
    })

    $(".firstItem").each(function(){
      let first = $(this)
      $(first).closest(".item").find(".diaryItems").each(function(){
        if($(this).attr("data-locsort") >= $(first).attr("data-locsort"))
        $(this).after(first)
      })
    })
var count = 0
    for(i = 0; i <= arrayObjId.length -1 ; i++){
      let eachDiary = $(".diaryBody").find("[data-objid='"+arrayObjId[i]+"']")
      let first = eachDiary.first()
      let firstItem = eachDiary.first().index()

      for(t = 0; t <= eachDiary.length - 1; t++){
        $(eachDiary).eq(t).parent().children().eq(firstItem).before($(eachDiary).eq(t))
        if($(eachDiary).eq(t).parent().prev().children().eq(firstItem).hasClass("diaryItems")){
          let prev = $(eachDiary).eq(t).parent().prev().children().eq(firstItem).attr("data-objid")
          $(eachDiary).eq(t).parent().find("[data-objid='"+prev+"']").after($(eachDiary).eq(t))
        }

        if(t == eachDiary.length - 1){
          let returning = insertAbove(arrayObjId,firstItem, i)
          if(returning = "wow"){
            count += 1
          }
        }
      }
    }

    if(count == arrayObjId.length){
      overFlow()
    }
  })
}

function insertAbove(arrayObjId,firstItem, index){
  let eachDiary = $(".diaryBody").find("[data-objid='"+arrayObjId[index]+"']")
    for(e = 0; e <= eachDiary.length-1; e++){
      let thisIndex = $(eachDiary).eq(e).index()
      let difference =  Number(firstItem) - Number(thisIndex)
      if(thisIndex != firstItem){
        if(difference > 0){
                    if($(eachDiary).eq(e).next().hasClass("diaryItems")){
                      for(t = 0; t<= difference; t++){
                        $(eachDiary).eq(e).next().before($(eachDiary).eq(e))
                      };
                    }
                  }

      }
    }
    for(t = 0; t<= eachDiary.length-1;t++){
      let thisIndex = $(eachDiary).eq(t).index()
      let difference =  Number(firstItem) - Number(thisIndex)
      switch (difference) {
        case 1: $(eachDiary).eq(t).before($(eachDiary).eq(t).next())

          break;
        case -1: $(eachDiary).eq(t).after($(eachDiary).eq(t).prev())

          break;
        default:

      }

      if(t == eachDiary.length-1){
          for(w = 0; w<= eachDiary.length-1; w++){
            let thisIndex = $(eachDiary).eq(w).index()
            let difference =  Number(firstItem) - Number(thisIndex)
            if(thisIndex != firstItem){
              if($(eachDiary).eq(e).next().hasClass("diaryItems")){
                for(t = 0; t<= difference; t++){
                  $(eachDiary).eq(e).next().before($(eachDiary).eq(e))
                };
              }
            }
          }
        return true
      }
    }
}

document.onload = addOneMonth(+0)

function newFormSubmission() {
  $.ajaxSetup({
    async: false
  });
  var certsstatus =[]
  var cardsstatus =[]
  var paperworkstatus = []

  $(".newFormLoading").show()
  const getRanHex = size => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
  }

  var bookingsArray = []

if($("#trainerOnly").val() == "true"){
  paperworkstatus = {"Stage": "N/A"}
} else {
  paperworkstatus = {"Stage": "Pending"}
}
  $(".bRow").each(function() {
    let awardingBody = $(this).find("#awardingBody").val()
    $.get("/courses",function(data){
      $.each(data, function(){
        if(this.AwardingBody.includes(awardingBody)){

          if(this.Certs == "No"){
            certsstatus = {"Stage": "N/A"}
          } else {
            certsstatus = {"Stage": "Pending"}
          }
          if(this.Cards == "No"){
            cardsstatus = {"Stage": "N/A"}
          } else {
            cardsstatus = {"Stage": "Pending"}
          }
        }
      })
    })

    var coursesArray = []
    $(this).find(".rowCT").each(function() {
      coursesArray.push({
        Course: $(this).find("#coursePickerInput").val(),
        BookedDelegates: $(this).find("#bookedDelegates").val(),
        TestingType: $(this).find("#levelPicker").val()
      })
    })

    bookingsArray.push({
      _id: getRanHex(24),
      el: $(this).find("#el").val(),
      Trainer: $(this).find("#newtrainerSelect").val(),
      Start: $(this).find("#start_date").val(),
      TimeScale: $(this).find("#timeScale").val(),
      End: $(this).find("#end_date").val(),
      TotalDays: $(this).find("#total").val(),
      SiteLocation: $(this).find("#siteLocation").val(),
      SiteContact: $(this).find("#siteContact").val(),
      SiteContactNumber: $(this).find("#siteContactNumber").val(),
      CandidateDayRate: $(this).find("#DayOrCandidate").val(),
      Rate: $(this).find("#rate").val(),
      CardsIncluded: $(this).find("#cardReq").val(),
      CardRate: $(this).find("#cardRate").val(),
      CourseInfo: coursesArray,
      Total: $(this).find("#totalBooking").val(),
      PONumber: $(this).find("#poNumber").val(),
      AwardingBody: $(this).find("#awardingBody").val(),
      TrainerStage: [{
        Stage: "New"
      }],
      Paperwork:[JSON.parse(JSON.stringify(paperworkstatus))],
      Register:[{'Stage':'Pending'}],
      Cards:[JSON.parse(JSON.stringify(cardsstatus))],
      Certs:[JSON.parse(JSON.stringify(certsstatus))],
      Invoice:[{'Stage':'Pending'}],
      Paid:[{'Stage':'Pending'}]
    })
  })

  if (window.navigator.onLine == true) {
    $.post("/request",

      {
        postReqTitle: $("#title").val(),
        postReqTraOn: $("#trainerOnly").val(),
        postReqOrg: $("#newOrgSelectInput").val(),
        postReqBooker: $("#newBookerSelect").val(),
        postReqBookEmail: $("#bookerEmail").val(),
        postReqBookings: bookingsArray,
        postReqOverall: $("#overallTotal").val(),
        postStatus: $("#status").val(),
        postCreatedBy: $(".currentLoggedOn").attr('data-userfn')
      },
      function(data, status) {
      }).done(setTimeout( function(){hideNewItem()},300));
  }


}

function newItemShow() {
  $(".newBookingFormOverLay").show()
}

function hideNewItem() {
  missingList()
  $(".stepBody").slideUp()
  $(".stepOne").children(".stepBody").slideDown()
  $(".newBookingFormOverLay").hide()
  $(".newBookingForm").children("input").val("")
  $(".rowCT").each(function() {
    switch ($(this).hasClass("rowOne")) {
      case false:
        $(this).remove()
        break;
      default:

    }
  })
  $(".bRow").each(function() {
    switch ($(this).hasClass("bookingRow")) {
      case false:
        $(this).remove()
        break;
      default:

    }
  })

$(".newFormLoading").hide()
}



document.onload = addFormData()

$(document).on("change", "#status", function() {

  $("#title").trigger("reset")
  if ($("#status").val() == "Holiday" || $("#status").val() == "Appointment") {
    $("#title").val($("#status").val())
  } else {
    $.get("/articles", function(data) {
      var itemCount = 0

      $.each(data, function(i) {
        if (data[i].VortexRef.startsWith("VB")|| data[i].VortexRef.startsWith("VN")) {
          itemCount++
        }
      })
      let location = Number(itemCount)
      let nextRef = Number(location) + 104
      let vortexRef = "VB-" + (nextRef + '').padStart(4, "0")
      $("#title").val(vortexRef)
    })
  }
})

function addFormData() {
  var orgarray = []
  $.get("/courses", function(data) {
    $.each(data, function(i) {
      let awardingBody = data[i].AwardingBody
      $(".awardingBody").append('<option value="' + awardingBody + '">' + awardingBody + '</option>')
      $("#matrixAwardingBody").append('<option value="' + awardingBody + '">' + awardingBody + '</option>')
    })
  })

  $.get("/CompanyData", function(data) {
    $.each(data, function(i) {
      let orgs = data[i].CompanyName
      orgarray.push(orgs)
      $.each(data[i].User, function(t) {
        if (this.TrainerForVortex == true) {
          let trainer = data[i].User[t].FullName
          $("#newtrainerSelect").append('<option value="' + trainer + '">' + trainer + '</option>')
          $("#edittrainerSelect").append('<option value="' + trainer + '">' + trainer + '</option>')

        }
      });
    })
    $.each(orgarray, function(i) {
      let individualOrg = orgarray[i]
      $("#newOrgSelect").append('<option value="' + individualOrg + '">' + individualOrg + '</option>')
    })
  })
}

function orgSelected() {
  $("#newBookerSelect").children().remove()
  $("#newBookerSelect").append('<option value="">Select One</option>')
  $.get("/CompanyData", function(data) {
    $.each(data, function(i) {
      let orgs = data[i]
      if (orgs.CompanyName == $(".newOrgSelectInput").val()) {
        let org = orgs.User
        $.each(org, function(t) {
          $("#newBookerSelect").append('<option value="' + org[t].FullName + '">' + org[t].FullName + '</option>');
        })
      }
    })
  })
}

function bookerSelected() {
  $.get("/CompanyData", function(data) {
    $.each(data, function(i) {
      let orgs = data[i]
      if (orgs.CompanyName == $(".newOrgSelectInput").val()) {
        let org = orgs.User
        $.each(org, function(t) {
          let booker = org[t].FullName
          if (booker == $("#newBookerSelect").val()) {
            let booker = org[t].EmailAddress
            $("#bookerEmail").attr("value", booker)
          };
        })
      }
    })
  })
}

function closeScreen() {
  const width = $(".bodyMain").width()
  const height = $(".bodyMain").height()

  $(".matrixBody").css("width", width).css("height", height)

  $(".matrixBody").slideUp(500)
  $(".bodyMain").delay(500).slideDown(500)

}

function addRow() {
  $(".bookingRow").clone().removeClass("bookingRow").addClass("bRow").appendTo(".courseBookings").append('<button type="button" name="button" class="btn btn-info removeRow">Remove Booking</button></span>')
}

$(document).on("click", ".removeRow", function() {
  $(this).parent().remove()
})


$(document).on("change", ".start_date", function() {
  let val = $(this).val().replaceAll("-0", "").replaceAll("-", "")
  $(this).parent().parent().find('#el').val(val)
})

$("#trainerOnly").click(function() {
  if ($(this).prop("checked")) {
    $(this).val(true)
  } else {
    $(this).val(false)
  };
})

$(document).on("change", "#awardingBody,  #matrixAwardingBody", function() {
  let item = this
  let currentVal = $(this).val()
  let parentVar = $(this).parent().parent().parent()
  if($(this).attr('id') != 'matrixAwardingBody'){
    $(parentVar).find(".courseOption").remove()
    $('#cardReq').children().remove()
    $('.testType').addClass('hidden')
    if($(this).val() == "NPORS"){
      $('.testType').removeClass('hidden')
    }
  } else {
      $("#matrixCardSelect").children().remove()
  }
  $.get("/courses", function(data) {
    let mainLookup = data

    $.each(mainLookup, function(i) {
      if (mainLookup[i].AwardingBody == currentVal) {
        let awardingBodyVar = mainLookup[i].Courses
        $.each(awardingBodyVar, function(t) {
          let course = awardingBodyVar[t].Course
          $(parentVar).find(".coursePicker").append('<option value="' + course + '" class="courseOption">' + course + '</option>');
        })
        $.each(this.AccreditationTypes, function(){
          if($(item).attr('id') != 'matrixAwardingBody'){
            $('#cardReq').append('<option value="'+this.Description+'">'+this.Description+'</option>')
          } else {
            $("#matrixCardSelect").append('<option value="'+this.Description+'">'+this.Description+'</option>')
          }
        })
      }
    })
  })
})

$(document).on("click", ".addcourseRowEditMode", function(){
  let clone = $(this).closest(".quickEditMode").clone()
  $(this).closest(".quickEditMode").after(clone)
  $(this).closest(".quickEditMode").next(".quickEditMode").find(".addcourseRowEditMode").text("-").removeClass("addcourseRowEditMode").addClass("removecourseRowEditMode").css("padding", "0 0.5rem")
})

$(document).on("click",".removecourseRowEditMode", function(){
  $(this).closest(".quickEditMode").remove()
})

$(document).on("click", ".addcourseRow", function() {
  $(this).parent().parent().clone().insertAfter($(this).parent().parent()).removeClass("rowOne")
  $(".rowCT").each(function(i) {
    switch ($(this).hasClass("rowOne")) {
      case false:
        $(this).find(".addRowContainer").text("-").removeClass("addcourseRow").addClass("removecourseRow").css("padding", "0 0.5rem")
        break;
    }
  })
})

$(document).on("click", ".removecourseRow", function() {
  $(this).parent().remove()
})




$(document).on("change", ".rateChange", function() {


  let totalDaysCalc = $(this).closest(".bRow").find("#total").val()
  let rateCalc = $(this).closest(".bRow").find("#rate").val()
  let selectedType = $(this).closest(".bRow").find("#DayOrCandidate").val()
  let cardRate = $(this).closest(".bRow").find("#cardRate").val()
  let cardSelection = $(this).closest(".bRow").find("#cardReq").val()
  let bookedTotal = 0
  let totalForBooking = $(this).closest(".bRow").find("#totalBooking")

  $(this).closest(".bRow").each(function() {
    $(this).children(".rowCT").each(function() {
      $(this).children().find(".bookedDelegates").each(function() {
        bookedTotal += Number($(this).val())
      })
    })
  })

  if (selectedType == "Day Rate") {
    let dayRateCalc = Number(totalDaysCalc * rateCalc)
    let cardRateCalc = Number(bookedTotal * cardRate)
    if (cardSelection === "No") {
      totalForBooking.val(dayRateCalc)
    } else {
      totalForBooking.val(dayRateCalc + cardRateCalc)
    }

  } else {
    let ratesCalc = Number(cardRate) + Number(rateCalc)
    let candRateCalc = Number(bookedTotal * ratesCalc)
    totalForBooking.val(candRateCalc)
  }
  let totalForAll = 0
  $(".totalBooking").each(function() {

    totalForAll += Number($(this).val())

    ;
  });

  $("#overallTotal").val(totalForAll)
})



function overFlow() {
  $(".diaryItems").removeClass("hideDI").css("display", "block")
  $(".hiddenItems").remove()
  $(".moreItems").remove()
  for(t = 0; t<= $(".item").length; t++){
    let item = $(".item").eq(t)
      let parentHeight = $(item).height()
      for(i = 0; i <= $(item).children(".diaryItems").length - 1; i++){
        let position = $(item).children(".diaryItems").eq(i).position()
        let itemHeight = $(item).children(".diaryItems").eq(i).height()
        let posHeiCalc = Number(parentHeight) - Number(itemHeight)
        if (position.top > posHeiCalc) {
          $(item).children(".diaryItems").eq(i).addClass("hideDI").css("display", "none")
        }
      }
      if(t == $(".item").length){
        overFlowList()
      }
  }
}

function overFlowList(){
  $(".item").each(function() {
    var hiddenItemsC = 0
    $(this).find(".hideDI").each(function(i) {
      hiddenItemsC = +i++;
    })
    var totalHidden = hiddenItemsC + 1
    if (totalHidden > 1) {
      $(this).find(".hideDI").first().before('<div class="hiddenItems"><i class="fa-solid fa-angle-down"></i>' + totalHidden + ' more bookings<i class="fa-solid fa-angle-down"></i></div>')
    }

  })
}


$(document).on("click", ".hiddenItems", function() {
  $(".popUp").remove()
  $(".bodyMain").append("<div class='popUp'></div>")
  let parentPosition = $(this).parent().position()
  let parentWidth = $(this).parent().width()
  let parentHeight = $(this).parent().height()
  let parentCh = $(this).parent().children()
  let topPos = Number(parentPosition.top)
  let leftPos = Number(parentPosition.left)
  let parentNext = $(this).parent().next()
  let parentPrev = $(this).parent().prev()
  $.each(parentCh, function() {
    let thisHeight = $(this).height()
    let parentChItem = $(this)
    let parentChId = Number($(this).index()) - 1
    totalHeight = +Number(thisHeight)
    if ($(this).hasClass("diaryItems")) {
      $(this).clone().appendTo(".popUp").removeClass("hideDI").css("display", "block").removeClass("widthx2").removeClass("widthx3").removeClass("widthx4").removeClass("widthx5").removeClass("widthx6").removeClass("widthx7")
    }
    $.each(parentNext.children("li"), function() {
      if ($(this).attr("data-objid") == parentChItem.attr("data-objId")) {
        $(".popUp").children().eq(parentChId).append('<i class="fa-solid fa-caret-right extendedRight"></i>')
      }
    })
    $.each(parentPrev.children("li"), function() {
      if ($(this).attr("data-objid") == parentChItem.attr("data-objId")) {
        $(".popUp").children().eq(parentChId).prepend('<i class="fa-solid fa-caret-left extendedLeft"></i>')
      }
    })
  })
  $(".popUp").css({
    top: topPos,
    left: leftPos,
    height: parentHeight,
    width: parentWidth
  },100)
  let heightNeeded = Number($('.popUp').children("li").length * 24)
  setTimeout(function(){
    $(".popUp").animate({'opacity':'100%', 'width':'20rem', 'height':heightNeeded, 'top': topPos - 30, 'left': leftPos - 54})
  },200)


})

$(document).click(function(clicked) {
  if (clicked.target.classList.contains("hiddenItems")) {} else {
    $(".popUp").css("display", "none")
  }
})

var alaphabetArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

$(document).on("click", ".vortalListItem", function() {
  $(".quickViewMenu").removeClass("quickViewOpen").addClass("hidden")
  $(this).toggleClass("active")
  if($(this).hasClass("active")){
    missingList()
    $(".unfinishedInfo").css({
      'width': "250px",
    })
    $(".missingInfo").show()
    setTimeout(function() {
      overFlow();
    }, 900);
  } else {
    $(".unfinishedInfo").css({
      'width': "0",
    })
    setTimeout(function() {
      $(".missingInfo").hide()
      $(".missingInfoDiv").children(".specificMissing").remove();
    }, 50)
    overFlow()

  }
})

$(".sortByMissing").on("change", function(){
  missingList()
})

function missingList(){
  $(".specificMissing").remove()
  $.get("/articles", function(data) {
    if($(".sortByMissing").val()== "Date: Oldest - Newest"){
      data.sort(function(a,b){
          return new Date(a.Bookings[0].Start)-new Date(b.Bookings[0].Start)

      })
    } else {
      data.sort(function(a,b){
          return new Date(b.Bookings[0].Start)- new Date(a.Bookings[0].Start)

      })
    }

    for(i = 0; i <= data.length-1; i++){
      let vortexRef = data[i].VortexRef
      let headerId = data[i]._id
      let overallStatus = data[i].Status
      if(vortexRef.startsWith("VB-")){
        for(t = 0; t<= data[i].Bookings.length -1; t++){
          let specific = data[i].Bookings[t]
          let bookingRef = vortexRef
          let totalComplete = []
          let paperworkComplete = ""
          let registerComplete = ""
          let cardsComplete = ""
          let certsComplete = ""
          let invoiceComplete = ""
          let paidComplete = ""
          if($(specific.Paperwork).last()[0].Stage == "N/A" || $(specific.Paperwork).last()[0].Stage == "Recieved"){
            paperworkComplete = "True"
            totalComplete.push("true")
          }
          if($(specific.Register).last()[0].Stage == "N/A" || $(specific.Register).last()[0].Stage == "Recieved"){
            registerComplete = "True"
            totalComplete.push("true")
          }
          if($(specific.Cards).last()[0].Stage == "N/A" || $(specific.Cards).last()[0].Stage == "Sent"){
            cardsComplete = "True"
            totalComplete.push("true")
          }
          if($(specific.Certs).last()[0].Stage == "N/A" || $(specific.Certs).last()[0].Stage == "Sent"){
            certsComplete = "True"
            totalComplete.push("true")
          }
          if($(specific.Invoice).last()[0].Stage == "N/A" || $(specific.Invoice).last()[0].Stage == "Invoiced"){
            invoiceComplete = "True"
            totalComplete.push("true")
          }
          if($(specific.Paid).last()[0].Stage == "N/A" || $(specific.Paid).last()[0].Stage == "Paid"){
            paidComplete = "True"
            totalComplete.push("true")
          }
          if(totalComplete.length < 6){
            if( $(specific.TrainerStage).last()[0].Stage == "Cancelled" ||overallStatus == "Cancelled" ){
              $(".missingInfoDiv").append("<div class='specificMissing' data-startDate="+specific.Start+" data-headerid=" + headerId + "><div class='missingHead'>" + bookingRef + " - Cancelled </div><div class='checkContainer'><div class='missingCheck paperwork"+$(specific.Paperwork).last()[0].Stage.toString().replaceAll("/","")+"'>Paperwork</div><div class='missingCheck register"+$(specific.Register).last()[0].Stage+"'>Register</div><div class='missingCheck cards"+$(specific.Cards).last()[0].Stage+"'>Cards</div><div class='missingCheck certs"+$(specific.Certs).last()[0].Stage.toString().replaceAll("/","")+"'>Certs</div><div class='missingCheck inv"+$(specific.Invoice).last()[0].Stage+"' >Invoice</div><div class='missingCheck paid"+$(specific.Paid).last()[0].Stage+"'>Paid</div></div></div>")

            } else {
              $(".missingInfoDiv").append("<div class='specificMissing' data-startDate="+specific.Start+" data-headerid=" + headerId + "><div class='missingHead'>" + bookingRef + " </div><div class='checkContainer'><div class='missingCheck paperwork"+$(specific.Paperwork).last()[0].Stage.toString().replaceAll("/","")+"'>Paperwork</div><div class='missingCheck register"+$(specific.Register).last()[0].Stage+"'>Register</div><div class='missingCheck cards"+$(specific.Cards).last()[0].Stage+"'>Cards</div><div class='missingCheck certs"+$(specific.Certs).last()[0].Stage.toString().replaceAll("/","")+"'>Certs</div><div class='missingCheck inv"+$(specific.Invoice).last()[0].Stage+"' >Invoice</div><div class='missingCheck paid"+$(specific.Paid).last()[0].Stage+"'>Paid</div></div></div>")

            }
          }

        }
      }
    }
  })
}

$(document).on("click", ".item", function(e) {
 if($(".quickViewMenu").hasClass("quickViewOpen")){
   if(e.target == this){
        $(".quickViewMenu").removeClass("quickViewOpen").addClass("hidden")
   }
 } else {
   if ($(".popUp").css("display") == "none") {
     if (e.target == this) {
       let dataStart = $(this).attr("data-datespan")
       let selectedDate = new Date(dataStart).toISOString().slice(0, 10)
       $("#start_date").val(selectedDate)
       newItemShow();
     }
   }
 }


})

$("#start_date").on("change", function() {
  $(".availablity").remove()
  let dateSelected = $(this).val()
  let trainers = $(this).parent().parent().find(".selectpicker").children()
  $.each(trainers, function(t) {
    $(this).attr("disabled", false)
  })
  var activeTrainers = []
  var halfActiveTrainers = []
  $.get("/articles", function(data) {
    $.each(data, function(i) {
      let dataA = data[i]
      let bookings = dataA.Bookings
      $.each(bookings, function(t) {
        let bookingDate = bookings[t].Start
        let totalDays = bookings[t].TotalDays
        if (totalDays == "0.5") {
          let dateNew = new Date(bookingDate)
          let newDate = dateNew.toISOString().substr(0, 10)
          if (newDate == dateSelected) {
            halfActiveTrainers.push({
              name: bookings[t].Trainer,
              ts: bookings[t].TimeScale
            })
          }

        } else {
          for (e = 0; e <= totalDays; e++) {
            let dateNew = new Date(bookingDate)
            let intDate = dateNew.setDate(dateNew.getDate() + e)
            let nextDay = new Date(intDate)
            console.log(data[i].VortexRef);
            let newDate = nextDay.toISOString().substr(0, 10)
            if (newDate == dateSelected) {
              activeTrainers.push(bookings[t].Trainer)
            }
          }
        }
      })
    })
    $.each(activeTrainers, function(key, value) {
      let active = value
      $.each(trainers, function(t) {
        if ($(this).val() == active) {
          $(this).attr("disabled", true)
        }
      })
    })
    $.each(halfActiveTrainers, function(t) {
      let active = this.name
      let ts = this.ts
      $.each(trainers, function() {
        if ($(this).val() == active) {
          $(this).attr("disabled", false)
          if (ts == "AM") {
            $(this).append("<span class='availablity'>-PM Available <span>")
          } else {
            $(this).append("<span class='availablity'>-AM Available <span>")
          }
        }
      })
    })
  })
})


$(document).on("change", ".timeScale", function() {
  $(this).parent().parent().parent().find("#end_date").val('')
  $(this).parent().parent().parent().find("#total").val('')
  let lineStart = $(this).parent().parent().parent().find("#start_date").val()
  if ($(this).val() != "FullDay") {
    $(this).parent().parent().parent().find("#end_date").val(lineStart)
    $(this).parent().parent().parent().find("#total").val(0.5)
  }
})


$(document).on("click", ".saveCourse", function() {
  $.ajaxSetup({
    async: true
  });
  let bookingsArray = []

  $(".matrixDetails").each( function(){
    let coursesArray = []
      let bookingDetails = $(this).children(".mBookings")
      let courseRows = $(this).find(".matrixCourseRow")
      $.each(courseRows, function(){
        coursesArray.push({
          Course: $(this).find(".course").text(),
          BookedDelegates: $(this).find(".bookers").text(),
          TestingType: $(this).find(".testType").text()
        })
      })
      $.each(bookingDetails, function(){
      bookingsArray.push({
        _id: $(this).find("#courseId").val(),
        el: $(this).find("#matrixBStart").val().replaceAll("-0","").replaceAll("-",""),
        Trainer: $(this).find("#matrixTrainer").val(),
        Start: $(this).find("#matrixBStart").val(),
        TimeScale: $(this).find("#matrixTimeScale").val(),
        End: $(this).find("#matrixBEnd").val(),
        TotalDays: $(this).find("#matrixTotalDays").val(),
        SiteLocation: $(this).find("#matrixLocation").val(),
        SiteContact: $(this).find("#matrixSiteContact").val(),
        SiteContactNumber: $(this).find("#matrixSiteCNumber").val(),
        CandidateDayRate: $(this).find("#matrixCorD").val(),
        Rate: $(this).find("#matrixRate").val(),
        CardsIncluded: $(this).find("#matrixCardsReq").val(),
        CardRate: $(this).find("#matrixCardRate").val(),
        CourseInfo: coursesArray,
        Total: $(this).find("#matrixTotal").val(),
        PONumber: $(this).find("#matrixPO").val(),
        AwardingBody: $(this).find("#matrixAwardingBody").val()
      })
      })
  })

  let inhouse = $("#matrixVIHC").val()
  let npors = $("#matrixNporsC").val()
  let eusrcards = $("#matrixEusrC").val()
  let eusrbatch = $("#matrixEusrB").val()
  let posted = $("#matrixCertsCards").val()
  let attendance = $("#matrixAttendance").val()
  let postoffice = $("#matrixPostOffice").val()
  let archive = $("#matrixArchive").val()
  if($(".section1").hasClass("Updated") || $(".section2").hasClass("Updated")){
    $.post("/bookingUpdate", {
      updateReqSelectedId: $(".matrixBody").attr("data-headerid"),
      updateReqBookingArray: bookingsArray,
      updateReqInhouse: inhouse,
      updateReqNpors: npors,
      updateReqEusr: eusrcards,
      updateReqBatch: eusrbatch,
      updateReqPosted: posted,
      updateReqAttend: attendance,
      updateReqPostOffice: postoffice,
      updateReqArchive: archive
    })
  }

})

$(document).on("click", ".courseAddition", function() {
  let firstName = $(this).parent().parent().children(".firstName").text()
  let surName = $(this).parent().parent().children(".surName").text()
  $(".courseUpdate").text(firstName + " " + surName + "'s course selection")
  $(".coursesAddition").slideDown()
  let userId = firstName.charAt(0).toUpperCase() + surName.charAt(0).toUpperCase() + $(this).closest(".matrixBody").children(".matrixVRef").text().replaceAll("-", '')
})

$(document).on("change", ".courseAttendedSelection", function(){
  if($(this).prop("checked") == true){
    $(this).val(true)
  } else {
    $(this).val(false)
  }

})

$(".newDelegate").on("click", function() {
  $.ajaxSetup({
    async: false
  });
  coursesArr = []
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == $(".matrixBody").attr("data-headerid")){
        let bookings = this.Bookings
        $.each(bookings, function(){
          courses = this.CourseInfo
          $.each(courses, function(){
            if($.inArray(this.Course, coursesArr) == -1){
              coursesArr.push(this.Course);
            }
          })
        })
      }
    })
  })
  tableArr = []


  $(".delegateHeadRow").after('<tr class="delegatesRow"><td class="hidden"><form method="post" enctype="multipart/form-data" id="delegatePhotoUp"><input type="file" name="delegatePhotoUpload" value="" id="delegatePhotoUpload"></form></td><td class="delegateData"><i class="fa-solid fa-trash deleteRow"></i></td><td class="delegateData"><i class="fa-solid fa-circle-user"></i></td><td class="delegateData hide userId"></td><td contenteditable="true" class="delegateData firstName"></td><td contenteditable="true" class="delegateData surName"></td><td contenteditable="true" class="delegateData dateOfBirth"></td><td contenteditable="true" class="delegateData company"></td><td contenteditable="true" class="delegateData mobileNumber"></td><td contenteditable="true" class="delegateData emailAddress"></td><td class="delegateData course"></td><td><table class="courseTable"><tr class="detailsCourses"><th>Course</th><th>Attended?</th><th>Date</th><th>Pass/Fail</th></table></td></tr>')
  $.each(coursesArr, function(){
    $(".delegateHeadRow").next().find(".detailsCourses").after('<tr class="courseOptions"><td class="courseItem coursesCell">'+this+'</td><td class="attendedItem coursePadding coursesCell"><input type="checkbox" name="" value="false" class="courseAttendedSelection coursePadding coursesCell"></td><td class="dateAttendedItem coursePadding coursesCell" contenteditable="true"></td><td class="passFailItem coursePadding coursesCell"contenteditable="true"></td><td class="coursePadding coursesCell" contenteditable="true"></td></tr>')
  })

})

$(document).on("input", ".firstName", function() {
  if ($(this).text() != "" && $(this).parent().children(".userId").text() == "") {
    $(this).parent().addClass("New")
  } else {
    $(this).parent().removeClass("New")
  }
})

$(document).on("input", ".delegateData", function() {
  if ($(this).text() != "" && $(this).parent().children(".userId").text() != "") {
    $(this).parent().addClass("Updated")
  }
})




$(document).on("click", ".deleteRow", function() {
  $(this).toggleClass("inverted")
  $(this).parent().parent().toggleClass("Delete")
  $(this).parent().parent().removeClass("Updated")
  $(this).parent().parent().removeClass("New")
})


$(document).on("input", ".course", function() {
  let amountOfCourses = $(this).text()
  $(this).parent().children(".courseInfo").remove()
  for (i = 0; i < amountOfCourses; i++) {
    $(this).after("<td contenteditable='true' class='group" + i + " courseInfo delegateCourse delegateData'>Course Here</td><td contenteditable='true' class='group" + i + " courseInfo delegateStart delegateData'>StartDate Here</td><td contenteditable='true' class='group" + i + " courseInfo delegatePassFail delegateData'>Pass/Fail</td><td contenteditable='true' class='group" + i + " courseInfo delegateTrainer delegateData'>Trainer</td>")
  }

})

$(document).on("click", ".trainingSpecs, .cardsBooked", function() {
  let copyText = $(this).html().replaceAll('<li class="tbText">', '').replaceAll('<li class="invoiceSpecs"> ', '').replaceAll('<li class="invoiceSpecs">', '').replaceAll('<p class="cardsReq">', '').replace('              ', '').replaceAll('</p>', '').replaceAll('<li class="namesInvoice">', '').replaceAll('</li>', "\n").replaceAll('<li>','\n')
  navigator.clipboard.writeText(copyText)
delegateUpdate("Invoice")
})

$(document).on("click", ".stepsHeader", function() {

  $(".stepsHeader").removeClass("dropShadow").parent().children(".stepBody").slideUp()
  $(this).addClass("dropShadow").parent().children(".stepBody").slideDown()
  $(".newOrgbody").slideUp()

  let org = $(".newOrgSelectInput").val()
  let booker = $("#newBookerSelect").val()
  let email = $("#bookerEmail").val()
  $(".detailsOverall").remove()
  if ($(this).parent().hasClass("stepThree")) {
    $(".bRow").each(function(i) {
      let start = new Date($(this).find("#start_date").val()).toLocaleDateString("en-GB")
      let end = new Date($(this).find("#end_date").val()).toLocaleDateString("en-GB")
      let timeScale = $(this).find("#timeScale").val()
      let totalDays = $(this).find("#total").val()
      let trainer = $(this).find("#newtrainerSelect").val()
      let location = $(this).find("#siteLocation").val()
      let contact = $(this).find("#siteContact").val()
      let contactNumber = $(this).find("#siteContactNumber").val()
      let awardingBody = $(this).find("#awardingBody").val()
      let cardSelection = $(this).find("#cardReq").val()
      let rateType = $(this).find("#DayOrCandidate").val()
      let rate = $(this).find("#rate").val()
      let cardRate = $(this).find("#cardRate").val()
      let bookingTotal = $(this).find("#totalBooking").val()
      $(".detailsMain").after("<div class='flexRow detailsOverall'><div class='detailsBooking'><li> Full Day/AM/PM: " + timeScale + "</li><li>  Start Date: " + start + " - End Date:" + end + " - Total Days: " + totalDays + "</li><li>Trainer: " + trainer + "</li><li>Site Location: " + location + "</li><li>Site Contact: " + contact + "  -  Contact Number: " + contactNumber + "</li><li>Awarding Body: " + awardingBody + "  -  Cards Req: " + cardSelection + "</li></div><div class='detailsRates'><li>Rate Type: " + rateType + "</li><li>Course Rate:£ " + rate + "</li><li>Card Rate:£ " + cardRate + "</li><li>Course Total:£ " + bookingTotal + "</li></div></div>")
      $(this).find(".rowCT").each(function() {
        let courses = $(this).find("#coursePickerInput").val()
        let nporsTesting = $(this).find("#levelPicker").val()
        let delegates = $(this).find("#bookedDelegates").val()
        if (awardingBody == "NPORS") {
          $(".detailsBooking").after("<div class='detailsCourses'><li> Course:" + courses + "  -  Testing Type:" + nporsTesting + "  -  Delegates Booked: " + delegates + "</li></div>")
        } else {
          $(".detailsBooking").after("<div class='detailsCourses'><li> Course:" + courses + "  -  Delegates Booked: " + delegates + "</li></div>")
        }
      });

    })


    if ($(".trainerOnly").val() == "true") {
      $(".detailsTO").text("Trainer Only")
    } else {
      $(".detailsTO").text("")
    }
    $(".detailsOrg").text(org)
    $(".detailsBooker").text(booker)
    $(".detailsEmail").text(email)
  }

})

$(document).on("change", "#status", function() {
  $(".confirmBooking").prop('disabled', false)
})

$(document).on("click", ".newUserOrg", function() {
  $(".newOrgBookerTable").append('<tr class="newOrgBookerRow"><td class="newBookerName" contenteditable="true"></td><td class="newBookerEmail" contenteditable="true"></td><td class="newBookerJob" contenteditable="true"></td><td><input type="checkbox" id="trainerForVortex" name="trainerForVortex"></td><td><input type="checkbox" id="accesstoVortal" name="trainerForVortex"></td><td><i class="fa-solid fa-trash removeBookerRow"></i></td></tr>')
})

$(document).on("click", ".removeBookerRow", function() {
  $(this).parent().parent().remove()
})

$(document).on("click", ".newTrainerTickBox", function() {
  if ($(this).prop("checked")) {
    $(this).val(true)
  } else {
    $(this).val(false)
  };
})

$(document).on("click", ".submitNewOrg", function() {

  let newOrgName = $("#newOrgName").val()
  let newOrgPostal = $("#newOrgPostal").val()
  let newOrgBilling = $("#newOrgBilling").val()
  let newOrgBookers = []

  $(".newOrgBookerRow").each(function() {
    let fullName = $(this).find(".newBookerName").text()
    let email = $(this).find(".newBookerEmail").text()
    let jobTitle = $(this).find(".newBookerJob").text()
    let trainerForVortex = $(this).find("#trainerForVortex").val()
    let vortalAccess = $(this).find("#accesstoVortal").val()
    newOrgBookers.push({
      FullName: fullName,
      EmailAddress: email,
      JobTitle: jobTitle,
      TrainerForVortex: trainerForVortex,
      VortalAccess: vortalAccess
    })
  })
  $.post("/organisationData",

    {
      postReqOrgTitle: newOrgName,
      postReqOrgPostal: newOrgPostal,
      postReqOrgBilling: newOrgBilling,
      postReqOrgUsers: newOrgBookers

    },
    function(data, status) {
      console.log(status);
    });


  $(".newOrgSelectInput").val(newOrgName)
  $(".newOrgSelect").children().remove()
  addFormData()
  orgSelected()
  $(".stepOne").children(".stepBody").slideDown()
  $(".newOrgbody").slideUp()
})


$('#newOrgName').on("change", function() {
  $('.orgWarning').remove()
  let newOrg = this
  let typedOrg = $(this).val()
  $.get("/companyData", function(data) {
    $.each(data, function() {
      if (typedOrg == this.CompanyName) {
        $(newOrg).parent().after('<p class="orgWarning">This organisaition already exists</p>')
      }
    })
  })
})

$(".newOrgSelectInput").on("click", function() {
  $(this).val('')
  $(".newOrgSelect").val('')
})

$(document).on("click", ".coursePickerSelect", function(){
  $(this).val('')
})

function addNewOrg() {
  $(".stepOne").children(".stepBody").slideUp()
  $(".newOrgbody").slideDown()
}

function newOrgCancel() {
  $(".stepOne").children(".stepBody").slideDown()
  $(".newOrgbody").slideUp()
}

$(document).on("submit","#delegatePhotoUp", function(event){
  event.preventDefault();
  let courseArray = []
  let courseRow = $(this).closest(".delegatesRow").find(".courseTable").children("tbody").children(".courseOptions")
  $.each(courseRow, function(){
    if($(this).children(".attendedItem").children(".courseAttendedSelection").val() == "true"){

      courseArray.push({
        Course: $(this).children(".courseItem").text(),
        Date: $(this).children(".dateAttendedItem").text(),
        PassFail: $(this).children(".passFailItem").text()
      })
    }
  })
  let firstName = $(this).closest(".delegatesRow").find(".firstName").text()
  let surname = $(this).closest(".delegatesRow").find(".surName").text()
  let userId = firstName.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase() + Math.floor(Math.random() * 20) + $(".matrixVRef").text().replaceAll("-","")
  let dob = $(this).closest(".delegatesRow").find(".dateOfBirth").text()
  let company = $(this).closest(".delegatesRow").find(".company").text()
  let mobileNumber = $(this).closest(".delegatesRow").find(".mobileNumber").text()
  let emailAddress = $(this).closest(".delegatesRow").find(".emailAddress").text()
  var data = new FormData($(this)[0]);
  data.append('UpdateCourseId', $(".matrixBody").attr("data-headerid"))
  data.append('UserId', userId)
  data.append('firstName', firstName)
  data.append('surname', surname)
  data.append('dateOfBirth', dob)
  data.append('company', company)
  data.append('mobileNo', mobileNumber)
  data.append('emailAddress', emailAddress)
  data.append('CourseOverall',JSON.stringify(courseArray))
  $.ajax({
             url:'/insertDelegate',
             type: 'POST',
             contentType: false,
             processData: false,
             cache: false,
             data: data,
             error: function(){
                 alert('Error: Document could not be uploaded, please try again');
             },
             complete: delegateUpdate("Inserted")
         })
})

$(".addNewDocQuickView").on("click",function(){
  $("#documentUploadQuick").click()
})

$("#documentUploadQuick").on("change",function(){
  $(".addNewDocQuickView").addClass("spinningAffect")
  setTimeout(function(){
  $("#docsUploadFormQuick").submit()
},1000)
})

$("#docsUploadFormQuick").on("submit", function(event){
   event.preventDefault();
  var data = new FormData($('#docsUploadFormQuick')[0]);
  data.append('selectedId', $(".quickViewMenu").attr("data-headerid"))
  data.append('selectedFolder', $(".addNewDocQuickView").attr("data-docupload"))
  data.append('uploadedBy', $(".currentLoggedOn").attr("data-userfn"))
    $.ajax({
               url:'/uploadMatrix',
               type: 'POST',
               contentType: false,
               processData: false,
               cache: false,
               data: data,
               error: function(){
                   alert('Error: Document could not be uploaded, please try again');
               },
               complete: function(data) {delegateUpdate("DocumentsQuick")}
           })
})

$(".addNewDoc").on("click",function(){
  $("#documentUpload").click()
})

$("#documentUpload").on("change",function(){
  $(".addNewDoc").addClass("spinningAffect")
  setTimeout(function(){
  $("#docsUploadForm").submit()
},1000)

})

$("#docsUploadForm").on("submit", function(event){
   event.preventDefault();
  var data = new FormData($('#docsUploadForm')[0]);
  data.append('selectedId', $(".matrixBody").attr("data-headerid"))
  data.append('selectedFolder', $(".addNewDoc").attr("data-docupload"))
  data.append('uploadedBy', $(".currentLoggedOn").attr("data-userfn"))
    $.ajax({
               url:'/upload',
               type: 'POST',
               contentType: false,
               processData: false,
               cache: false,
               data: data,
               error: function(){
                   alert('Error: Document could not be uploaded, please try again');
               },
               complete: function(data) {delegateUpdate("Documents")}
           })
})

$(document).on('click','.matrixDocs', function(){
  $(".matrixDocs").removeClass("active")
  $(this).addClass("active")
  let selected = $(this).text().split(" (")
  $(".addNewDoc").attr('data-docupload',selected[0])
  docUpload()
})

$(document).on('click','.matrixDocsQuick', function(){
  console.log(true);
  $(".matrixDocsQuick").removeClass("active")
  $(this).addClass("active")
  let selected = $(this).text().split(" (")
  $(".addNewDocQuickView").attr('data-docupload',selected[0])
  $(".docItemQuickView").remove()
  activeMatrixDoc()
})

$(document).on("click",".documentDrop", function(){
  $(this).parent().parent().children().slideDown()
  $(this).removeClass("fa-caret-right documentDrop").addClass("fa-caret-down documentUp")
});

$(document).on("click", ".documentUp", function(){
  $(this).parent().parent().children(".hidden").slideUp()
$(this).removeClass("fa-caret-down documentUp").addClass("fa-caret-right documentDrop")
});


$(document).on("click", ".delegatePhoto", function(){
  $(".downloadImage").attr("href", $(this).attr("src"))
  $(".downloadImage")[0].click()
})

$(document).on("click", ".docDelete", function(){
  let matrixId = $(".matrixBody").attr("data-headerid")
  let docKey = $(this).closest(".docItem").attr("data-filekey")
  let docName = $(this).closest(".docItem").children().eq(0).text()
  let confirmation = confirm("Are you sure you want to delete " + docName + "? This will be permanently deleted from Vortal")
  if(confirmation == true){
    $.post("/docDelete",{
      deleteDocLocation: matrixId,
      deleteDocKey: docKey,
      deleteDocFolder: $(".addNewDoc").attr("data-docupload")
    }).done(function(){docUpload()})
  }
})

$(document).on("click", ".quickdocDelete", function(){
  let matrixId = $(".quickViewMenu").attr("data-headerid")
  let docKey = $(this).closest(".docItemQuickView").attr("data-filekey")
  let docName = $(this).closest(".docItemQuickView").children().eq(0).text()
  let confirmation = confirm("Are you sure you want to delete " + docName + "? This will be permanently deleted from Vortal")
  if(confirmation == true){
    $.post("/docDelete",{
      deleteDocLocation: matrixId,
      deleteDocKey: docKey,
      deleteDocFolder: $(".addNewDocQuickView").attr("data-docupload")
    }).done(function(){docUploadQuick()})
  }
})

$(document).on("click",".docRename", function(){
if($(this).closest(".docItem").find(".nameChange").length == 0){
  $(this).closest(".docItem").children("td").eq(0).append('<span class="nameChange docExtra"><div><input type="text" name="" value="" class="form-control newDocName" placeholder="Enter New Name"></div><div class="docRenameExtra"><span class="docExtra"><i class="far fa-check-circle acceptChange"></i></span><span class="docExtra"><i class="far fa-times-circle cancelChange"></i></span></div></span>')

}
})

$(document).on("click",".quickdocRename", function(){
if($(this).closest(".docItemQuickView").find(".nameChange").length == 0){
  $(this).closest(".docItemQuickView").children("td").eq(0).append('<span class="nameChange docExtra"><div><input type="text" name="" value="" class="form-control newDocName" placeholder="Enter New Name"></div><div class="docRenameExtra"><span class="docExtra"><i class="far fa-check-circle quickacceptChange"></i></span><span class="docExtra"><i class="far fa-times-circle cancelChange"></i></span></div></span>')

}
})

$(document).on("click",".cancelChange", function(){
  $(this).closest(".nameChange").remove()
})

$(document).on("click",".acceptChange", function(){

  $.post("/docNameChange", {
    docLocation: $(".matrixBody").attr("data-headerid"),
    docKey: $(this).closest(".docItem").attr("data-filekey"),
    docNew: $(this).closest(".nameChange").find(".newDocName").val(),
    docFolder: $('.addNewDoc').attr("data-docupload")
  }).done(function(){docUpload()})
})

$(document).on("click",".quickacceptChange", function(){
console.log("change");
  $.post("/docNameChange", {
    docLocation: $(".matrixBody").attr("data-headerid"),
    docKey: $(this).closest(".docItemQuickView").attr("data-filekey"),
    docNew: $(this).closest(".nameChange").find(".newDocName").val(),
    docFolder: $('.addNewDocQuickView').attr("data-docupload")
  }).done(function(){docUploadQuick()})
})



$(document).on("click", ".fa-circle-user", function(){
$(this).closest(".delegatesRow").find("#delegatePhotoUpload").trigger('click')
})

$(document).on("change", "#delegatePhotoUpload", function(){
  if($(this)[0].files.length > 0){
    let createUrl = URL.createObjectURL(this.files[0])
    $(this).closest(".delegatesRow").children().eq(2).children(".fa-circle-user").remove()
    $(this).closest(".delegatesRow").children().eq(2).prepend('<img src='+createUrl+' alt="" class="delegatePhoto">')

  }
})


async function delegateUpdate(updated){
$(".delegatesRow").remove()
  $(".namesHere").remove()

  switch (updated) {
    case "Inserted":
      $(".flex-container").append('<div class="copiedpopUp hidden">Delegate Updated</div>')
      $(".copiedpopUp").fadeIn(400)
      setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})},1400)
      break;
      case "Updated":
      $(".flex-container").append('<div class="copiedpopUp hidden">Delegate Updated</div>')
      $(".copiedpopUp").fadeIn(400)
      setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})},1400)
      break;
      case "Deleted":
      $(".flex-container").append('<div class="copiedpopUp deletedPopUp hidden">Delegate Deleted</div>')
      $(".copiedpopUp").fadeIn(400)
      setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})},1400)
      break;
      case "Invoice":
      $(".flex-container").append('<div class="copiedpopUp hidden">Invoice Data Copied</div>')
      $(".copiedpopUp").fadeIn(400)
      setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})},1400)
        break;
          case "Archive":
          $.get("/articles", function(data){
            $.each(data, function(){
              if(this._id == $(".matrixBody").attr('data-headerid')){
                $(".archiveLocation").text(this.ArchiveBoxNumber)
              }
            })
          }).done(function(){
            $(".archiveInput").val('')
            $(".taskDateStamp").val('')
          })
          $(".flex-container").append('<div class="copiedpopUp hidden">Archive Box Updated</div>')
          $(".copiedpopUp").fadeIn(400)
          setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})},1400)
            break;

            case "Documents":
                  $(".addNewDoc").removeClass("spinningAffect")
                  $(".flex-container").append('<div class="copiedpopUp hidden">Document Uploaded</div>')
                  $(".copiedpopUp").fadeIn(400)
                  docUpload()
                  setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})},1400)
              break;
              case "DocumentsQuick":
                    $(".addNewDocQuickView").removeClass("spinningAffect")
                    docUploadQuick()
                    $(".flex-container").append('<div class="copiedpopUp hidden">Document Uploaded</div>')
                    $(".copiedpopUp").fadeIn(400)
                    docUpload()
                    setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})},1400)
                break;


              case "Booking":                  $(".flex-container").append('<div class="copiedpopUp hidden">Booking Updated</div>')
                                $(".copiedpopUp").fadeIn(400)
                                notesUpdates()
                                missingList()
                                setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})
                                detailsUpdate($(".clickedBooking"))

                                },1400)

                break;

                case "OrgAdded":      $(".flex-container").append('<div class="copiedpopUp hidden">New Org Added</div>')
                                  $(".copiedpopUp").fadeIn(400)
                                  setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()})
                                  },1400)
                                  orgLoad()
                                  $('.newUser').show()
                                  $('.orgUserDetails').show()
                                  $(".employeeHeader").show()
                                  $(".newOrg").addClass("saveOrg").removeClass("newOrg")

                break;

                case "OrgUpdate":    $(".flex-container").append('<div class="copiedpopUp hidden">Org Updated</div>')
                                  $(".copiedpopUp").fadeIn(400)
                                  setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()
                                  orgDetails($('.orgOverlay').attr('data-orgid'))
                                }

                                      )
                                  },1400)

                  break;

                  case "CourseUpdate": $(".flex-container").append('<div class="copiedpopUp hidden">Courses Updated</div>')
                                    $(".copiedpopUp").fadeIn(400)
                                    $(".courseOverlay").animate({'right': '-30%'})
                                    $('.courseOverlay').removeClass("Open")
                                    $(".courseListItem").remove()
                                    $(".accredTyping").remove()
                                    $(".awardingBodyInput").slideUp()
                                    $("#awardingBodyPaperwork").prop('checked',false).val("No")
                                    $("#awardingBodyCerts").prop('checked',false).val("No")
                                    $("#awardingBodyCards").prop('checked',false).val("No")
                                    courseLoad()
                                    setTimeout(function(){$(".copiedpopUp").fadeOut(1300, function(){$(".copiedpopUp").remove()
                                  })},1400)

                    break;
  }
}



function docUpload(){
  $("#docsUploadForm").trigger('reset')
  $(".docItem").remove()
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == $(".matrixBody").attr("data-headerid")){
        let item = this
        switch ($(".addNewDoc").attr('data-docupload')) {
          case "Register": $.each(item.Documents.Register, function(){
              $(".docDetails").append('<tr class="docItem" data-fileKey="'+this.FileKey+'" data-filelocation="'+this.Location+'"><td>'+this.FileName+'</td><td>'+this.Date+'</td><td>'+this.UploadedBy+'</td><td>'+this.Status+'</td><td><span class="docOptions docRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions docDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
          })
            break;
            case "Cert/Card(s)":$.each(item.Documents.CertificationOrCards, function(){
                $(".docDetails").append('<tr class="docItem" data-fileKey="'+this.FileKey+'" data-filelocation="'+this.Location+'"><td>'+this.FileName+'</td><td>'+this.Date+'</td><td>'+this.UploadedBy+'</td><td>'+this.Status+'</td><td><span class="docOptions docRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions docDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
            })
            break;
            case "Frontsheet":$.each(item.Documents.FrontSheets, function(){
                $(".docDetails").append('<tr class="docItem" data-fileKey="'+this.FileKey+'" data-filelocation="'+this.Location+'"><td>'+this.FileName+'</td><td>'+this.Date+'</td><td>'+this.UploadedBy+'</td><td>'+this.Status+'</td><td><span class="docOptions docRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions docDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
            })
            break;
            case "Paperwork":
            $.each(item.Documents.Paperwork, function(){
                $(".docDetails").append('<tr class="docItem" data-fileKey="'+this.FileKey+'" data-filelocation="'+this.Location+'"><td>'+this.FileName+'</td><td>'+this.Date+'</td><td>'+this.UploadedBy+'</td><td>'+this.Status+'</td><td><span class="docOptions docRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions docDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
            })
              break;

              case "Misc":
              $.each(item.Documents.Misc, function(){
                  $(".docDetails").append('<tr class="docItem" data-fileKey="'+this.FileKey+'" data-filelocation="'+this.Location+'"><td>'+this.FileName+'</td><td>'+this.Date+'</td><td>'+this.UploadedBy+'</td><td>'+this.Status+'</td><td><span class="docOptions docRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions docDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
              })
                break;

        }
        let regDoc = this.Documents.Register
        let paperwork = this.Documents.Paperwork
        let front = this.Documents.FrontSheets
        let coc = this.Documents.CertificationOrCards
        let misc = this.Documents.Misc
        $(".docNumber").remove()
        $(".matrixDocs").each(function(){
          switch ($(this).text()) {
            case "Register": $(this).append("<span class='docNumber'> ("+ regDoc.length + ") <span>")

              break;
              case "Paperwork": $(this).append("<span class='docNumber'> ("+ paperwork.length + ") <span>")

                break;
                case "Frontsheet": $(this).append("<span class='docNumber'> ("+ front.length + ") <span>")

                  break;
                  case "Cert/Card(s)": $(this).append("<span class='docNumber'> ("+ coc.length + ") <span>")

                    break;
                    case "Misc": $(this).append("<span class='docNumber'> ("+ misc.length + ") <span>")

                      break;

          }
        })
      }
    })
  })
}

function docUploadQuick(){
  $(".docItemQuickView").remove()
  $(".docNumberQuick").remove()
    $.get("/articles", function(data){
      for(i = 0; i <= data.length-1;i++){
        if(data[i]._id == $(".quickViewMenu").attr('data-headerid')){
          let regDoc = data[i].Documents.Register
          let paperwork = data[i].Documents.Paperwork
          let front = data[i].Documents.FrontSheets
          $(".matrixDocsQuick").each(function(){
            switch ($(this).text()) {
              case "Register": $(this).append("<span class='docNumberQuick'> ("+ regDoc.length + ") <span>")

                break;
                case "Paperwork": $(this).append("<span class='docNumberQuick'> ("+ paperwork.length + ") <span>")

                  break;
                  case "Frontsheet": $(this).append("<span class='docNumberQuick'> ("+ front.length + ") <span>")

                    break;

            }
          })
          activeMatrixDoc()
        }
      }
    })
}

function activeMatrixDoc() {
    $.get("/articles", function(data){
    for(i = 0; i <= data.length-1;i++){
      if(data[i]._id == $(".quickViewMenu").attr('data-headerid')){
        switch ($(".addNewDocQuickView").attr('data-docupload')) {
          case 'Register':
          for(t = 0; t<= data[i].Documents.Register.length -1; t++){
            let docs = data[i].Documents.Register[t]
            $(".matrixDocDetails").append('<tr class="docItemQuickView" data-fileKey="'+docs.FileKey+'" data-filelocation="'+docs.Location+'"><td>'+docs.FileName+'</td><td>'+docs.Date+'</td><td>'+docs.UploadedBy+'</td><td>'+docs.Status+'</td><td><span class="docOptions quickdocRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions quickdocDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
          }
            break;
            case 'Frontsheet':
            for(t = 0; t<= data[i].Documents.FrontSheets.length -1; t++){
              let docs = data[i].Documents.FrontSheets[t]
              $(".matrixDocDetails").append('<tr class="docItemQuickView" data-fileKey="'+docs.FileKey+'" data-filelocation="'+docs.Location+'"><td>'+docs.FileName+'</td><td>'+docs.Date+'</td><td>'+docs.UploadedBy+'</td><td>'+docs.Status+'</td><td><span class="docOptions quickdocRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions quickdocDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
            }
              break;
              case 'Paperwork':
              for(t = 0; t<= data[i].Documents.Paperwork.length -1; t++){
                let docs = data[i].Documents.Paperwork[t]
                $(".matrixDocDetails").append('<tr class="docItemQuickView" data-fileKey="'+docs.FileKey+'" data-filelocation="'+docs.Location+'"><td>'+docs.FileName+'</td><td>'+docs.Date+'</td><td>'+docs.UploadedBy+'</td><td>'+docs.Status+'</td><td><span class="docOptions quickdocRename docExtra hidden"><i class="fas fa-edit"></i></span><span class="docOptions quickdocDelete docExtra hidden"><i class="fas fa-trash"></i></span></td></tr>')
              }
                break;
        }
      }
    }
  })
}

$(document).on({
    mouseenter: function () {
      $(this).find(".docOptions").removeClass("hidden")
    },
    mouseleave: function () {
$(this).find(".docOptions").addClass("hidden")
    }
}, ".docItem");

$(document).on({
    mouseenter: function () {
      $(this).find(".docOptions").removeClass("hidden")
    },
    mouseleave: function () {
$(this).find(".docOptions").addClass("hidden")
    }
}, ".docItemQuickView");

$(document).on("click",".docItem", function(e){
  let target = e.target
  console.log(!$(target).hasClass("fa-trash") || !$(target).hasClass("fa-edit"));
  if(!$(target).closest("span").hasClass('docExtra')){
  $(".OverlayThree").animate({'right': '0'})
  $(".matrixViewer").attr("data", '')
  $(".matrixViewer").attr("data", $(this).attr('data-filelocation')).removeClass("hidden")
}
})

$(document).on("click",".hideViewer", function(){
  $(".OverlayThree").animate({'right': '-65%'})
  $(".matrixViewer").attr("data", '').addClass("hidden")
})

///to delete? ///
$(".saveDelegates").on("click", function(){
    setTimeout(function(){
      $(".delegatesRow").remove()
      $(".namesHere").remove()
      $.get("/articles", function(data){
          $.each(data, function(){
            if(this._id == $(".matrixBody").attr("data-headerid")){
              let delegates = this.Delegates
              $.each(delegates, function(i) {
                let userId = this.UserId
                let firstName = this.FirstName
                let surName = this.Surname
                let dob = this.DateOfBirth
                let company = this.Company
                let mobileNumber = this.MobileNumber
                let emailAddress = this.EmailAddress
                let courseArray = this.CoursesAttended
                let imageLocation = this.ImageLocation
                let imageKey = this.ImageKey
                var coursesStructure = []
                var courseLength = 0
                $(courseArray).each(function(i) {
                  courseLength = Number(i) + 1
                  let course = this.Course
                  let date = this.Date
                  let passFail = this.PassFail
                  coursesStructure.push('<tr class="courseOptions"><td class="courseItem coursesCell">'+course+'</td><td class="dateAttendedItem coursePadding" contenteditable="true">'+date+'</td><td class="passFailItem coursePadding"contenteditable="true">'+passFail+'</td><td class="coursePadding" contenteditable="true"></td></tr>')
                })
                var imageTest = ""
                if(imageLocation == "" || imageLocation == null || imageLocation == undefined){
                  imageTest = '<td class="delegateData delImage"><i class="fa-solid fa-circle-user"></i><button type="button" name="button" class="btn btn-primary btn-sm changeImage hidden">Change Photo</button></td>'
                } else {
                  imageTest = '<td class="delegateData delImage"><img src='+imageLocation+' alt="" class="delegatePhoto"><button type="button" name="button" class="btn btn-primary btn-sm changeImage hidden">Change Photo</button><p class="imgKey hidden">'+imageKey+'</p></td>'
                }

                if(courseArray == null || courseArray == undefined || courseArray == ""){
                  $(".delegateHeadRow").after('<tr class="delegatesRow"><td class="delegateData hidden"><form method="post" enctype="multipart/form-data" id="delegatePhotoChange"><input type="file" name="changePhoto" value="" id="changePhoto"></form></td><td class="delegateData"><i class="fa-solid fa-trash deleteRow"></i></td>'+imageTest+'<td class="delegateData hide userId">' + userId + '</td><td contenteditable="true" class="delegateData firstName">' + firstName + '</td><td contenteditable="true" class="delegateData surName">' + surName + '</td><td contenteditable="true" class="delegateData dateOfBirth">' + dob + '</td><td contenteditable="true" class="delegateData company">' + company + '</td><td contenteditable="true" class="delegateData mobileNumber">' + mobileNumber + '</td><td contenteditable="true" class="delegateData emailAddress">' + emailAddress + '</td><td class="delegateData course">' + courseLength + '<button type="button" name="button" class="btn btn-light addCourses"><i class="fas fa-plus"></i></button></td></tr>')
                } else {
                  $(".delegateHeadRow").after('<tr class="delegatesRow"><td class="delegateData hidden"><form method="post" enctype="multipart/form-data" id="delegatePhotoChange"><input type="file" name="changePhoto" value="" id="changePhoto"></form></td><td class="delegateData"><i class="fa-solid fa-trash deleteRow"></i></td>'+imageTest+'<td class="delegateData hide userId">' + userId + '</td><td contenteditable="true" class="delegateData firstName">' + firstName + '</td><td contenteditable="true" class="delegateData surName">' + surName + '</td><td contenteditable="true" class="delegateData dateOfBirth">' + dob + '</td><td contenteditable="true" class="delegateData company">' + company + '</td><td contenteditable="true" class="delegateData mobileNumber">' + mobileNumber + '</td><td contenteditable="true" class="delegateData emailAddress">' + emailAddress + '</td><td class="delegateData course">' + courseLength + '<button type="button" name="button" class="btn btn-light addCourses"><i class="fas fa-plus"></i></button></td><td><table class="courseTable"><tr class="detailsCourses"><th>Course</th><th>Date</th><th>Pass/Fail</th>'+coursesStructure.toString().replaceAll(",","")+'</table></td></tr>')

                }


                $(".cardsReq").append('<li class="namesInvoice namesHere">' + firstName + ' ' + surName + '</li>')
              })
            }
          })
      })



    }, 80)
})


$(document).on("input", ".mBookings, .bookingDetails", function(){
  $(this).closest(".section1").addClass("Updated")

})

$( ".itemHover" ).hover(

  function() {
    let attribute = $(this).attr("data-navitem")
    let location = $(this).position()
    let locationLeft = location.left + 54
    let locationTop = location.top + 10
      $(".navTag").text(attribute)
      $(".navTag").css({top: locationTop, left: locationLeft});
      $(".navTag").delay(2).show()

  }, function() {
    $(".navTag").hide(0);
  }
);


$(".vortalNavItem").on("click", function(){
  $(".quickViewMenu").removeClass("quickViewOpen").addClass("hidden")
  $(".vortalNavItem").removeClass("active")
  $(".pdfViewer").hide()
  $(".overLayCandidate").animate({'right': '-70%'})
  $('.overLayCandidate').removeClass("Open")
  $(".orgOverlay").animate({'right': '-70%'})
  $('.orgOverlay').removeClass("Open")
  $(".courseOverlay").animate({'right': '-30%'})
  $('.courseOverlay').removeClass("Open")
  $(this).addClass("active")
  if($(".matrixBody").find(".Updated").length > 0){
    let confirmation = confirm("You are trying to leave this page with unsaved items. If you close this page now it will not save. Do you want to continue?")
    if(confirmation == true){
      openWindow($(this))
    }
  } else {
    openWindow($(this))
  }

})

function openWindow(selected) {
  $(".matrixBody").find(".Updated").removeClass("Updated")
  switch ($(selected).attr("data-navitem")) {
    case "Dashboard": $(".vortalWindow").slideUp(400)
                      $(".dashboardMain").css({
                          "height": "95vh",
                          "width": "95vw"
                        })
                      $(".dashboardMain").delay(400).slideDown(400);


      break;
    case "Diary":$(".vortalWindow").slideUp(400)
                    $(".bodyMain").css({
                      "height": "95vh",
                      "width": "95vw"
                    })
                $(".bodyMain").delay(400).slideDown(400);
                addOneMonth(0)

      break;

      case "Documents":$(".vortalWindow").slideUp(400)
                      $(".bodyMain").css({
                        "height": "95vh",
                        "width": "95vw"
                      })
                      documentsLoad()
                  $(".documentsMain").delay(400).slideDown(400);

        break;

        case "Delegates": $(".vortalWindow").slideUp(400)
                          $(".delegatesMain").delay(400).slideDown(400);
                          delegateLoad()
          break;
        case "Organisations": $(".vortalWindow").slideUp(400)
                          $(".orgMain").delay(400).slideDown(400)
                          orgLoad()
          break;

          case "Courses": $(".vortalWindow").slideUp(400)
                            $(".coursesMain").delay(400).slideDown(400)
                            courseLoad()
            break;
  }
}

function documentsLoad(){
  $(".folderName").remove()
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this.VortexRef.startsWith('VB-'))
      $(".docTableMain").append('<tr class="folderName" data-headerId="'+this._id+'"><td><i class="fas fa-folder documentFolders"></i></td><td>'+this.VortexRef+'</td><td>'+this.Organisation+'</td></tr>')
    })
  })
}

$(document).on("click", ".folderName",function(){
  $(".pdfViewer").hide()
  $(".docTableFolder").show()
  $(".innerFolderView").hide()
  $(".currentlyFolder").remove()
 $(".currentlyOpen").remove()
 $(".folderName").removeClass("selectedFolder")
 $(this).addClass("selectedFolder")
 $(this).append('<td class="currentlyOpen"> <i class="fas fa-chevron-right openDocIndicator"></i> </td>')
$(".registerCount").text("")
  let selectedId = $(this).attr("data-headerid")

  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == selectedId){
                      $(".registerCount").text("(" + this.Documents.Register.length + ")")
                        $(".paperworkCount").text("(" + this.Documents.Paperwork.length + ")")
                        $(".frontSheets").text("(" + this.Documents.FrontSheets.length + ")")
                          $(".otherCount").text("(" + this.Documents.Misc.length + ")")
                            $(".cotCount").text("(" + this.Documents.CertificationOrCards.length + ")")
      }
    })

  })

})


$(document).on("click", ".viewFolder", function(){
  $(".innerFolderView").show()
  $(".itemisedFile").remove()
  $(".currentlyFolder").remove()
  $(this).append('<span class="currentlyFolder"> <i class="fas fa-chevron-right openDocIndicator"></i> </span>')
  let string = $(this).text()
  switch (string.slice(0, string.length - 5)) {
    case "Register":
            $.get("/articles", function(data){
              $.each(data, function(){
                if(this._id == $(".selectedFolder").attr("data-headerid"))
                $.each(this.Documents.Register, function(){
                  $(".innerFolderView").append('<tr class="itemisedFile"><td data-docLink="'+this.Location+'">'+this.FileName+'</td></tr>')
                })
              })
            })
      break;
      case "Paperwork":
              $.get("/articles", function(data){
                $.each(data, function(){
                  if(this._id == $(".selectedFolder").attr("data-headerid"))
                  $.each(this.Documents.Paperwork, function(){
                    $(".innerFolderView").append('<tr class="itemisedFile"><td data-docLink="'+this.Location+'">'+this.FileName+'</td></tr>')
                  })
                })
              })
        break;
        case "FrontSheet(s)":
                $.get("/articles", function(data){
                  $.each(data, function(){
                    if(this._id == $(".selectedFolder").attr("data-headerid"))
                    $.each(this.Documents.FrontSheets, function(){
                      $(".innerFolderView").append('<tr class="itemisedFile"><td data-docLink="'+this.Location+'">'+this.FileName+'</td></tr>')
                    })
                  })
                })
          break;
        case "Certification & Cards":
                $.get("/articles", function(data){
                  $.each(data, function(){
                    if(this._id == $(".selectedFolder").attr("data-headerid"))
                    $.each(this.Documents.CertificationOrCards, function(){
                      $(".innerFolderView").append('<tr class="itemisedFile"><td data-docLink="'+this.Location+'">'+this.FileName+'</td></tr>')
                    })
                  })
                })
          break;
          case "Other Docs":
                  $.get("/articles", function(data){
                    $.each(data, function(){
                      if(this._id == $(".selectedFolder").attr("data-headerid"))
                      $.each(this.Documents.Misc, function(){
                        $(".innerFolderView").append('<tr class="itemisedFile"><td data-docLink="'+this.Location+'">'+this.FileName+'</td></tr>')
                      })
                    })
                  })
            break;

  }
})


$(document).on("click", ".itemisedFile", function(){
  let docLink = $(this).children().attr("data-docLink");
  $(".pdfViewer").attr("src", " ")
  $(".pdfViewer").attr("src", docLink).show()
})

$(".courseSearchMissing").on("input", function(){
  $.ajaxSetup({
    async: false
  });
let currentInput = $(this).val()
let courseId = []
if( !$(this).val()){
  $(".specificMissing").each(function(){
    $(this).show()
  })
} else {

  switch ($(".searchOptions").val()) {
    case "Reference":
    $.get("/articles", function(data){
      $.each(data, function(i){
        if(data[i].VortexRef.includes( currentInput)){
          courseId.push(this._id);
        }
      });
    });
      break;
      case "Delegate":
      $.get("/articles", function(data){
        $.each(data, function(i){
          delegates = this.Delegates
          let delegateId = this._id
          $.each(delegates, function(){
            let fullName = this.FirstName + " " + this.Surname
            if(fullName.includes( currentInput.charAt(0).toUpperCase() + currentInput.slice(1))){
              courseId.push(delegateId);
            }
          })
        });
      });

        break;
        case "Organisation":
        $.get("/articles", function(data){
          $.each(data, function(i){
            if(this.Organisation.includes( currentInput.charAt(0).toUpperCase() + currentInput.slice(1))){
              courseId.push(this._id);
            }
          });
        });
          break;
  }
$(".specificMissing").each(function(){
  if($.inArray($(this).attr("data-headerid"), courseId) == -1){
    $(this).hide()
  }
})
}
})



$(".fa-magnifying-glass").on("click", function(){

  $(".searchBox").animate({left: 72}, 400)
})

$(".closeSearch").on("click", function(){

  $(".searchBox").animate({'left': '-30%'}, 400)
})


$(".searchTextBox").on("change", function(){
  $.ajaxSetup({
    async: false
  })
  $(".foundScroll").children().remove()
let currentInput = $(this).val()
let courseId = []
if( !$(this).val()){
$(".foundScroll").children().remove()
$(".foundScroll").append("<p>Awaiting Input..<p>")
} else {

  switch ($(".searchDropDown").val()) {
    case "VortexRef":
    $.get("/articles", function(data){
      $.each(data, function(i){
        if(data[i].VortexRef.includes( currentInput)){
          courseId.push(this._id);
        }
      });
    });
    $(".foundScroll").append("<div class='foundHead'><div>Ref & Company</div><div> Courses Booked </div><div>Delegates</div></div>")

      break;
      case "Delegate":
      $.get("/articles", function(data){
        $.each(data, function(i){
          let delegateId = this._id
          $.each(this.Bookings, function(){
            delegates = this.Delegates
            $.each(delegates, function(){
              let fullName = this.FirstName + " " + this.Surname
              if(fullName.includes( currentInput.charAt(0).toUpperCase() + currentInput.slice(1))){
                courseId.push(delegateId);
              }
            })
          })

        });
      });
      $(".foundScroll").append("<div class='foundHead'><div class='delSearchImage'>"+"&nbsp;"+"</div><div> Full Name </div><div>Vortex Ref</div><div>Courses</div></div>")
        break;
        case "Organisation":
        $.get("/articles", function(data){
          $.each(data, function(i){
            if(this.Organisation.includes( currentInput.charAt(0).toUpperCase() + currentInput.slice(1))){
              courseId.push(this._id);
            }
          });
        });
        $(".foundScroll").append("<div class='foundHead'><div>Organisation</div><div>Vortex Ref</div><div>Date(s)</div></div>")
          break;
          case "Start":
          $.get("/articles", function(data){
            $.each(data, function(i){
              let headBooking = this._id
              $.each(this.Bookings, function(){
                if(this.Start == currentInput){
                  courseId.push(headBooking);
                }
              })

            });
          });
          $(".foundScroll").append("<div class='foundHead'><div>Dates</div><div>Vortex Ref</div><div>Organisation</div><div>Courses</div><div>Delegates</div></div>")
            break;
  }
}

if(courseId.length == 0){
  $(".foundScroll").children().remove()
  $(".foundScroll").append('<div>No Data Found. Please try again</div>')
} else {
  $.each(courseId, function(){
    let itemisedId = this
    $.get("/articles", function(data){
      $.each(data,function(){
        if(this._id == itemisedId){
          let bookings = this.Bookings
          let fullBookingArray = []
          let bookingsArray = []
          let delegateArray = []
          let delegateImage = []
          let dateArray = []
          let delegates = ""
          var courseString = ""
          $.each(bookings, function(){
            delegates = this.Delegates
            $.each(this.Delegates, function(){
              let delegateString = "<div>"+this.FirstName+ " "+ this.Surname +"</div>"
              if($.inArray(delegateString, delegateArray) == -1){
                delegateArray.push(delegateString);
              }
            })
            let course = this.CourseInfo
            let courseArray = []
            $.each(course, function(){
              let bookingString = "<div>"+this.Course+"</div>"
              if($.inArray(bookingString, bookingsArray) == -1){
                bookingsArray.push(bookingString);
              }
              let courseString = "<div>"+this.Course+"</div>"
              courseArray.push(courseString)
            })
            courseString = courseArray.toString().replaceAll(",","")
            let fullstring = "<div>"+new Date(this.Start).toLocaleDateString("en-gb")+" - "+new Date(this.End).toLocaleDateString("en-gb")+"<div>"+courseArray+"</div></div>"
            fullBookingArray.push(fullstring)
            let dateString = new Date(this.Start).toLocaleDateString("en-gb")+" - "+new Date(this.End).toLocaleDateString("en-gb")
            dateArray.push(dateString)
          });
  switch ($(".searchDropDown").val()) {
    case "VortexRef":
    $(".foundScroll").append('<div class="foundItem" data-headerid="'+this._id+'"><div>'+this.VortexRef+' - '+this.Organisation+'</div><div class="bookingList">'+bookingsArray.toString().replaceAll(",","")+'</div><div class="delegateList">'+delegateArray.toString().replaceAll(",","")+'</div></div>')
      break;
    case "Delegate":
    let course = this

      $.each(delegates, function(){
        let name = this.FirstName + " " + this.Surname
        let courses = []
        if(name.includes(currentInput.charAt(0).toUpperCase() + currentInput.slice(1))){
          $.each(this.CoursesAttended, function(){
            let courseDetails = "<div>"+this.Course+" - "+this.Date+" - "+this.PassFail+"</div>"
            courses.push(courseDetails)

          })
          if(this.ImageLocation == null ||this.ImageLocation == undefined ||this.ImageLocation == "" ){
            $(".foundScroll").append('<div class="foundItem" data-headerid="'+course._id+'"><div class="delSearchImage"><div class="seachEnginePlaceholder"></div></div><div>'+name+'</div><div>'+course.VortexRef+'</div><div>'+courses.toString().replaceAll(",","")+'</div></div>')
          } else {
            $(".foundScroll").append('<div class="foundItem" data-headerid="'+course._id+'"><div class="delSearchImage"><img src="'+this.ImageLocation+'" alt="" class="delSearchPhoto"></div><div>'+name+'</div><div>'+course.VortexRef+'</div><div>'+courses.toString().replaceAll(",","")+'</div></div>')
          }
        }
      })


      break;
    case "Organisation":
    $(".foundScroll").append('<div class="foundItem" data-headerid="'+this._id+'"><div>'+this.Organisation+'</div><div>'+this.VortexRef+'</div><div class="delegateList">'+fullBookingArray.toString().replaceAll(",","")+'</div></div>')
      break;

      case "Start":
      $(".foundScroll").append('<div class="foundItem" data-headerid="'+this._id+'"><div>'+dateArray.toString().replaceAll(",","")+'</div><div>'+this.VortexRef+'</div><div>'+this.Organisation+'</div><div>'+courseString+'</div><div>'+delegateArray.toString().replaceAll(",","")+'</div></div>')
        break;
  }
        }
      });
    });
  });
}

})


$(".searchDropDown").on("change", function(){
    $('.searchTextBox').val("")
    $(".foundScroll").children().remove()
if($(this).val() == "Start"){
  $('.searchTextBox').attr("type", "date")
} else {
  $('.searchTextBox').attr("type", "text")
}
})


$(".addTask").on("click", function(){
  $.ajaxSetup({
    async: false
  });
  switch (true) {
    case $(this).closest(".partHead").hasClass("sectionTwoPartOne"):
    let awardingBodyArr = []
      $.get("/articles", function(data){
        $.each(data, function(){
          if(this._id === $(".matrixBody").attr("data-headerid")){
            let bookings = this.Bookings
            $.each(bookings, function(){
              let awardingBody = '<option value="'+this.CardsIncluded+'">'+this.CardsIncluded+'</option>'
              if($.inArray(awardingBody, awardingBodyArr) == -1){
                awardingBodyArr.push(awardingBody);
              }
            })

          }
        })
      })
    $(".sectionTwoPartOne").find(".partHeader").after('<div class="input-group newTaskInput" data-tasktype="Accreditation"><div class="col-md-4"><select class="form-control inputControllerNT accredType" name="">'+awardingBodyArr.toString().replaceAll(",","")+'</select></div><div class="col-md-4"><select class="form-control taskStage inputControllerNT" name=""><option value="">Select a Stage</option><option value="Requested">Requested</option><option value="Recieved">Recieved</option><option value="Posted">Posted</option><option value="Replacement Requested">Replacement Req.</option><option value="Replacement Recieved">Replacement Rec.</option><option value="Replacement Posted">Replacement Posted</option></select></div><div class="col-md-4"><input class="form-control taskDateStamp inputControllerNT" type="text" name="" value=""></div></div><div><button type="button" name="button" class="btn btn-success submitTask">Submit</button></div>');

      break;
      case $(this).closest(".partHead").hasClass("sectionTwoPartTwo"):
      $(".sectionTwoPartTwo").find(".partHeader").after('<div class="input-group newTaskInput paperworkInput" data-tasktype="Paperwork"><div class="col-md-4"><select class="form-control inputControllerNT accredType" name=""><option value="">Select Type</option><option value="Paperwork">Paperwork</option><option value="Register">Register</option></select></div><div class="col-md-4"><select class="form-control taskStage inputControllerNT" name=""><option value="">Select a Stage</option><option value="Requested">Requested</option><option value="Recieved">Recieved</option></select></div><div class="col-md-4"><input class="form-control taskDateStamp inputControllerNT" type="text" name="" value=""></div></div><div><button type="button" name="button" class="btn btn-success submitTask">Submit</button></div>');

        break;
        case $(this).closest(".partHead").hasClass("sectionTwoPartThree"):
        $(".sectionTwoPartThree").find(".partHeader").after('<div class="input-group newTaskInput" data-tasktype="Archive"><div class="col-md-2"><input class="form-control archiveInput inputControllerNT" type="text" name="" value=""></div><div class="col-md-5"><input class="form-control taskDateStamp inputControllerNT" type="text" name="" value=""></div></div><div><button type="button" name="button" class="btn btn-success submitTask">Submit</button></div>');
          break;


  }
})


$(document).on("change",".archiveInput", function(){
  $(this).closest(".taskType").find(".taskDateStamp").val(new Date().toLocaleDateString("en-gb"))
})


$(document).on("click", ".submitTask", function(){
  let taskType = ""
  switch (true) {
    case $(this).closest(".taskType").hasClass("archiveBox"): taskType = "Archive"

      break;
    default:

  }
let accredType = $(this).closest(".partHead").find(".accredType").val()
let taskStage = $(this).closest(".partHead").find(".taskStage").val()
let taskDate = $(this).closest(".taskType").find(".taskDateStamp").val()

$.post("/newTask", {
  selectedId: $(".matrixBody").attr("data-headerid"),
  newArchiveBox: $(".archiveInput").val(),
  newTaskArea: taskType,
  newTaskAccr: accredType,
  newTaskStage: taskStage,
  newTaskDate: taskDate,
  newTaskCreated: $(".currentLoggedOn").attr("data-userfn")
}).done(function(){

  delegateUpdate(taskType)})


})


$(document).on({
    mouseenter: function () {
      let hoverId = $(this).attr("data-objid")
        $(".diaryItems").each(function(){
          if($(this).attr("data-objid") == hoverId){
            $(this).css({
              'background-color': '#3F72AF',
              'color': "white",
              "cursor": "pointer"
          })
          }
        })
    },
    mouseleave: function () {
      let hoverId = $(this).attr("data-objid")
        $(".diaryItems").each(function(){
          if($(this).attr("data-objid") == hoverId){
            $(this).css({
              'background-color': '',
              'color': "",
              "cursor": ""
          })
          }
        })
    }
}, ".diaryItems");

$(document).on("click",".qvEdit" ,function(){
  $(this).addClass("hidden")
  $(".quickViewDetails ").slideUp(300)
  $(".quickViewEditMode").delay(300).slideDown()
  let selectedId = $(this).closest(".quickViewMenu").attr("data-headerid")
  let specificId = $(this).closest(".quickViewMenu").attr("data-objid")
  let parent = $(this).closest(".quickViewMenu").find(".editModeBody")
  let awardingBody = ""
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == selectedId){
        let bookings = this.Bookings
        $.each(bookings, function(){
          $(parent).find("#editStart").val(new Date(this.Start).toISOString().substr(0, 10))
          $(parent).find("#editEnd").val(new Date(this.End).toISOString().substr(0, 10))
          $(parent).find(".trainerSelect").val(this.Trainer)
          $(parent).find("#editLocation").val(this.SiteLocation)
          $(".editModeAwardingBody").val(this.AwardingBody)
          awardingBody = this.AwardingBody
          if(this._id == specificId){
            let courses = this.CourseInfo
            $.each(courses, function(i){
              $(".editModeCourses").append('<div class="input-group quickEditMode editModeCourseItems"><div class="input-group-prepend"><label class="input-group-text" for="inputGroupSelect01">Course</label></div><input list="coursePicker" id="coursePickerInput" class="coursePickerSelect form-control editModeInputs" type="text" name="" value="'+this.Course+'" autocomplete="off"><datalist class="coursePicker" id="coursePicker" autocomplete="off"></datalist><div class="col-md-3"><select class="levelPicker form-select testType editModeInputs " name="levelPicker" id="levelPicker" name=""><option value="NPORS Testing Type">Select One</option><option value="Novice">Novice</option><option value="Refresher">Refresher</option><option value="EWT">EWT</option><option value="Conversion">Conversion</option></select></div><div class="col-md-1"><input class="form-control bookedDel editModeInputs" type="text" name="" value="'+this.BookedDelegates+'"></div><div class="addRowContainer addcourseRowEditMode">+</div></div>')
              $(".editModeCourses").eq(i).find(".levelPicker").val(this.TestingType)
            })
          }
        })
      }
    })
  })
  $.get("/courses", function(data) {
    let mainLookup = data

    $.each(mainLookup, function(i) {
      if (mainLookup[i].AwardingBody == awardingBody) {
        let awardingBodyVar = mainLookup[i].Courses
        $.each(awardingBodyVar, function(t) {
          let course = awardingBodyVar[t].Course
          $(".editModeCourses").find(".coursePicker").append('<option value="' + course + '" class="courseOption">' + course + '</option>');
        })
      }
    })
  })

})


$(document).on("click", ".quickEditCancel" ,function(){
  $(".qvEdit").removeClass("hidden")
  $(".quickViewEditMode").slideUp(300)
  $(".quickViewDetails").delay(300).slideDown(300)
  $(".editModeCourses").delay(600).children().remove()
})


$(document).on("click", ".quickEditSubmit", function(){
  let start = $(".quickViewEditMode").find("#editStart").val()
  let end = $(".quickViewEditMode").find("#editEnd").val()
  let endDateCalc = new Date(end).getTime()
  let startDateCalc = new Date(start).getTime()
  let startDate = new Date(start)
  let calcTotal1 = endDateCalc - startDateCalc
  let calcTotal2 = calcTotal1 / (1000 * 3600 * 24) + 1;
  let totalDays = calcTotal2
  let el = $(".quickViewEditMode").find("#editStart").val().replaceAll("-0", "").replaceAll("-", "")
  let awardingBody = $(".quickViewEditMode").find("#awardingBody").val()
  let trainer = $(".quickViewEditMode").find("#edittrainerSelect").val()
  let location =$(".quickViewEditMode").find("#editLocation").val()
  let courses = []
  $(".editModeCourseItems").each(function(){
    let courseDetails = {
      Course: $(this).find(".coursePickerSelect").val(),
      BookedDelegates: $(this).find(".bookedDel").val(),
      TestingType: $(this).find(".levelPicker").val()
    }
    courses.push(courseDetails)
  })

  $.post("/quickUpdate", {
    SelectedId: $(".quickViewMenu").attr("data-headerid"),
    bookingId: $(".quickViewMenu").attr("data-objid"),
    Start: start,
    End: end,
    Total: totalDays,
    el: el,
    Trainer: trainer,
    awardingBody: awardingBody,
    SiteLocation: location,
    Courses: courses
  },
  function(data, status) {
  }).done(function(){
    $(".courseQV").remove()
    quickView($(".quickViewMenu"))
    addOneMonth(+0)
    $(".qvEdit").removeClass("hidden")
      $(".quickViewEditMode").slideUp(300)
      $(".quickViewDetails").delay(300).slideDown(300)
      $(".editModeCourses").delay(600).children().remove()
  })
})

$(document).on("click",".closeBooking", function(){
  let item = $(".clickedBooking")
  if($('.OverlayOne').hasClass("Open")){
    if($('.OverlayOne').hasClass("modified")){
      let question = confirm("This booking has been modified. Are you sure you want to leave without saving?")

        if(question == true){
          $(item).removeClass("clickedBooking")
          $(".OverlayOne").animate({'right': '-70%'})
          $('.OverlayOne').removeClass("Open")
          $('.OverlayOne').removeClass("modified")
      }
    } else {
      $(item).removeClass("clickedBooking")
      $(".OverlayOne").animate({'right': '-70%'})
      $('.OverlayOne').removeClass("Open")
      $('.OverlayOne').removeClass("modified")
    }
  }
})

$(document).on("change",".stagesDetails ,.bookingDetails, .courseDetailsInner", function(){
  $(".OverlayOne").addClass("modified")
})

$(document).on("click",".itemBooking", function(){
  let item = this
  if($('.OverlayOne').hasClass("Open")){
    if($('.OverlayOne').hasClass("modified")){
      let question = confirm("This booking has been modified. Are you sure you want to leave without saving?")

        if(question == true){
          $(item).removeClass("clickedBooking")
          $(".OverlayOne").animate({'right': '-70%'})
          $('.OverlayOne').removeClass("Open")
          $('.OverlayOne').removeClass("modified")
      }
    } else {
      $(item).removeClass("clickedBooking")
      $(".OverlayOne").animate({'right': '-70%'})
      $('.OverlayOne').removeClass("Open")
      $('.OverlayOne').removeClass("modified")
    }
  } else {
    $(item).addClass("clickedBooking")
    detailsUpdate(this)

  }
})

function detailsUpdate(selected){
  $(".courseRowsMatrix").remove()
  $("#matrixCardSelect").children().remove()
  $("#matrixBatchNumber").val('')
  $("#matrixTrackingNumber").val('')
  var bookedCourses = []
  var selectedtestingType = []
  var nporsTesting=["NPORS Testing Type", "Novice", "Refresher","EWT","Conversion"]
  var cardSelected = ""
  $(".delegateDetailsMatrix").remove()
  $(".testingType").show()
  let selectedId = $(selected).attr('data-specificid')
  $.get('/articles', function(data){
    for(i = 0; i <= data.length -1; i++){
      let item = data[i]
      if(item._id == $(".matrixBody").attr("data-headerid")){
        for(t = 0; t<= item.Bookings.length -1; t++){
          let booking = item.Bookings[t]
          if(booking._id == selectedId){
            $(".delegateDetailsEdit").attr("data-specificid", selectedId)
            $("#matrixStart").val(booking.Start)
            $("#matrixEnd").val(booking.End)
            $("#matrixDays").val(booking.TotalDays)
            $("#matrixTimeScale").val(booking.TimeScale)
            $("#matrixLocation").val(booking.SiteLocation)
            $("#matrixSiteContact").val(booking.SiteContact)
            $("#matrixCotactNumber").val(booking.SiteContactNumber)
            $("#matrixAwardingBody").val(booking.AwardingBody)
            cardSelected = booking.CardsIncluded
            if(booking.RefNumber != undefined){
              $("#matrixBatchNumber").val(booking.RefNumber)
            }
            if(booking.PostalTracking != undefined){
              $("#matrixTrackingNumber").val(booking.PostalTracking)
            }
            for(ci = 0; ci <= booking.CourseInfo.length -1; ci++){
              bookedCourses.push('<tr class="courseRowsMatrix"><td><input type="text" name="" class="form-control matrixCourseDesc"  value="'+booking.CourseInfo[ci].Course+'"></td><td><input type="text" name="" class="form-control courseTestingType" value="'+booking.CourseInfo[ci].TestingType+'"></td><td><input type="text" name="" value="'+booking.CourseInfo[ci].BookedDelegates+'" class="form-control matrixBookedDel"></td></tr>')
            }
            if(booking.Delegates != undefined){
              for(e = 0; e <= booking.Delegates.length - 1; e++){
                let delegate = booking.Delegates[e]
                let delCourseArr = []
                let editCourseArr = []
                let signInArr = []
                if(delegate.Course != undefined){
                  for(d = 0; d <= delegate.Course[0].length - 1; d++){
                    let courseD = delegate.Course[0][d]
                    if(courseD.PassFail == "Fail"){
                      delCourseArr.push('<li >Course Details : '+courseD.Course+ ' - '+ new Date(courseD.Date).toLocaleDateString('en-gb') + ' - '+courseD.PassFail+'</li><li class="hidden">Reason :'+courseD.FailReason+'</li>')
                    } else {
                    delCourseArr.push('<li>Course Details : '+courseD.Course+ ' - '+ new Date(courseD.Date).toLocaleDateString('en-gb') + ' - '+courseD.PassFail+'</li>')
                  }
                  }
                }
                if(delegate.SignIn != undefined || delegate.SignIn != null){
                  for(s = 0; s<= delegate.SignIn.length-1; s++){
                    signInArr.push('<li class="hidden">Date: '+delegate.SignIn[s].Date+ ' - ' +'Trainer: '+delegate.SignIn[s].Trainer+'</li>')
                  }
                }

                let location = ""
                if(delegate.ImageLocation == undefined){
                  location = '/Images/vortalPortraitStandIn.png'
                } else {
                  location = delegate.ImageLocation
                }
                $(".delegatesScroll").append('<div class="delegateDetailsMatrix" data-userid="'+delegate.UserId+'"><div class="imgPlaceHolder"><div class="delegateImg" style="background-image: url('+location+');"></div><button type="button" name="button" class="editPhoto">Edit</button></div><div class="baseInfo"><div><li>Full Name : '+ delegate.FirstName+' '+delegate.Surname+'</li><li class="hidden">D.O.B : '+new Date(delegate.DateOfBirth).toLocaleDateString('en-gb')+'</li><li class="hidden">Contact Number : '+delegate.MobileNumber+'</li><li class="hidden">Email Address : '+delegate.EmailAddress+'</li><li class="hidden">Organisation : '+delegate.Company+'</li></div><div>'+delCourseArr.toString().replaceAll(",","")+'</div></div><div></div><div class="hidden editInfo"><i class="fas fa-edit"></i> Edit </div><div class="moreInfo"><i class="fas fa-plus"></i><span> More Information</span></div><div class="signInInfo hidden"> Sign In Details : '+signInArr.toString().replaceAll(",","")+'</div>')
              }

            }
            $(".courseInner").append(bookedCourses.toString().replaceAll(",",""))
              $('.OverlayOne').addClass("Open")
              $(".OverlayOne").animate({'right': '0'})

          }
        }
      }
    }
  })
}


$(document).on("click", ".moreInfo", function(){
  $(this).closest(".delegateDetailsMatrix").animate({'height': '15rem'})
  $(this).closest(".delegateDetailsMatrix").find(".hidden").slideDown()
  $(this).addClass("lessInfo").removeClass("moreInfo")
  $(this).children(".fa-plus").addClass("fa-minus").removeClass("fa-plus")
  $(this).children('span').text($(this).children('span').text().replace("More Information","Less Information"))
})

$(document).on("click", ".lessInfo", function(){
  $(this).closest(".delegateDetailsMatrix").removeClass("editMode")
  $(this).closest(".delegateDetailsMatrix").animate({'height': '144px'})
  $(this).closest(".delegateDetailsMatrix").find(".hidden").slideUp()
  $(this).closest(".delegateDetailsMatrix").find(".baseInfo").show()
  $(this).closest(".delegateDetailsMatrix").find(".signInInfo").hide()
  $(this).closest(".delegateDetailsMatrix").find(".editInfo").hide()
  $(this).closest(".delegateDetailsMatrix").find(".editDetails").hide()
  $(this).addClass("moreInfo").removeClass("lessInfo")
  $(this).children(".fa-minus").addClass("fa-plus").removeClass("fa-minus")
  $(this).children('span').text($(this).children('span').text().replace("Less Information","More Information"))

})

$(document).on("click",'.editInfo, .cancelEdit, .newCandidate' ,function(){
  let item = this
  if($('.OverlayTwo').hasClass("Open")){
    $(".OverlayTwo").animate({'right': '-70%'})
    $('.OverlayTwo').removeClass("Open")
    $(".delegateImgTwo").css({'background-image': "url('/Images/vortalPortraitStandIn.png')"})
    $("#delegatePhotoChange")[0].reset()
    $(".delegateForm").trigger('reset')
    $(".delegateDetailsEdit").removeAttr("data-userid")
  } else {
    $('.OverlayTwo').addClass("Open")
    $(".OverlayTwo").animate({'right': '0'})
    $(".delegateDetailsEdit").attr("data-userid", $(this).closest(".delegateDetailsMatrix").attr("data-userid"))
    delegateDetailsFill($(this).closest(".delegateDetailsMatrix").attr("data-userid"))
  }
})


function delegateDetailsFill(selected){
  $(".courseDetailsRow").remove()
  if(selected != undefined){
  var assignedCourses = []
    $.get("/articles", function(data){
      $.each(data, function(){
        if( this._id == $(".matrixBody").attr('data-headerid')){
          $.each(this.Bookings, function(){
            let courseArr = []
            let trainer = this.Trainer
            $.each(this.CourseInfo, function(){
              courseArr.push('<option value="'+this.Course+'">'+this.Course+'</option>')
            })
            if(this._id == $(".delegateDetailsEdit").attr("data-specificid")){
              $.each(this.Delegates, function(){
                if(this.UserId == selected){
                  let location = ""
                  if(this.ImageLocation == undefined){
                    location = '/Images/vortalPortraitStandIn.png'
                  } else {
                    location = this.ImageLocation
                  }
                  $(".delegateImgTwo").css('background-image', 'url(' + location + ')').attr('data-imgkey',this.ImageKey);
                  $("#editModeFirstName").val(this.FirstName)
                  $("#editModeSurname").val(this.Surname)
                  $("#editModeDOB").val(this.DateOfBirth)
                  $("#editModeMobileNumber").val(this.MobileNumber)
                  $("#editModeEmailAddress").val(this.EmailAddress)
                  $("#editModeCompany").val(this.Company)
                  $("#editModeIdCheck").val(this.IdCheckType)
                  $("#editModeLastDigits").val(this.idCheckDigits)
                  let courseList = []

                  if(this.Course[0] != undefined){
                    $.each(this.Course[0], function(){
                      let reason = ""
                      let passFail = ""
                      if(this.PassFail == "Fail"){
                        passFail = '<select value="'+this.PassFail+'" class="form-control editModeInput detailsPassFail"><option value="Pass">Pass</option><option value="Fail" selected>Fail</option></select>'
                      } else {
                        passFail = '<select value="'+this.PassFail+'" class="form-control editModeInput detailsPassFail"><option value="Pass" selected>Pass</option><option value="Fail">Fail</option></select>'
                      }
                      if(this.FailReason != undefined){
                        reason =' <input class="form-control editModeInput detailsFailReason" type="text" name="" value="'+this.FailReason+'">'
                      } else {
                        reason = '<input class="form-control editModeInput detailsFailReason" type="text" name="" value="N/A">'
                      }
                        assignedCourses.push(this.Course)
                        courseList.push('<tr class="courseDetailsRow"><td><select value="" class="form-control editModeInput detailsCourse">'+courseArr.toString().replaceAll(",","")+'</select></td><td><input type="date" name="" value="'+this.Date+'" class="form-control editModeInput detailsDate"></td><td><input class="form-control editModeInput detailsTrainer" type="text" name="" value="'+this.Trainer+'"></td><td>'+passFail+'</td><td>'+reason+'</td><td><span class="removeEditRow">Remove<span></td></tr>')

                    })
                    $(".courseInfoEditMode").append(courseList.toString().replaceAll(",",""))
                  }
                }
              })
            }
          })
        }
      })
    }).done(function(){
      $.each(assignedCourses, function(t){
        $(".courseDetailsRow").eq(t).find('.detailsCourse').val(this.toString())
      })
    })
  }
}

$(document).on({mouseenter: function(){
$(this).find(".editCandidatePhoto").show(250)
$(this).find(".delegateImgTwo").animate({'opacity': '0.5'}, 250)
},
mouseleave: function(){
$(this).find(".editCandidatePhoto").hide(250)
$(this).find(".delegateImgTwo").animate({'opacity': '1'},250)
}
}, ".imgPlaceHolderTwo")

$(document).on({mouseenter: function(){
$(this).find(".editPhoto").show(250)
$(this).find(".candidateImgTwo").animate({'opacity': '0.5'}, 250)
},
mouseleave: function(){
$(this).find(".editPhoto").hide(250)
$(this).find(".candidateImgTwo").animate({'opacity': '1'},250)
}
}, ".imgPlaceHolderTwo")


$(document).on("click", ".editPhoto", function(){
  $(this).closest(".OverlayTwo").find("#changePhoto").trigger('click')
})

$(document).on("change","#changePhoto", function(){
  if($(this)[0].files.length > 0){
    let createUrl = URL.createObjectURL(this.files[0])
    $(this).closest(".OverlayTwo").find(".delegateImgTwo").css('background-image', 'url(' + createUrl + ')')
  }
})

$(document).on("click",".submitEdit",function(){
  $("#delegatePhotoChange").submit()
})

$(document).on("submit","#delegatePhotoChange", function(event){
  event.preventDefault();
  let courseArray = []
  $(this).closest(".OverlayTwo").find(".courseDetailsRow").each(function(){
    courseArray.push({
      Course: $(this).find(".detailsCourse").val(),
      Trainer: $(this).find(".detailsTrainer").val(),
      PassFail: $(this).find(".detailsPassFail").val(),
      FailReason: $(this).find(".detailsFailReason").val(),
      Date: $(this).find('.detailsDate').val()
    })
  })

  let firstName = $("#editModeFirstName").val()
  let surname = $("#editModeSurname").val()
  let userId = ""
  let dob = $("#editModeDOB").val()
  let company = $("#editModeCompany").val()
  let mobileNumber = $("#editModeMobileNumber").val()
  let emailAddress = $("#editModeEmailAddress").val()
  let idCheck = $("#editModeIdCheck").val()
  let idDigits = $("#editModeLastDigits").val()
  let photoKey = $(".delegateImgTwo").attr('data-imgkey')
  if($(".delegateDetailsEdit").attr("data-userid") != undefined){
    userId = $(".delegateDetailsEdit").attr("data-userid")
  } else {
    userId = firstName.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase() + Math.floor(Math.random() * 20) + $(".vortexRefMatrix").text().replaceAll("-","")
  }
  var data = new FormData($(this)[0]);
  data.append('UpdateCourseId', $(".matrixBody").attr("data-headerid"))
  data.append('SpecificId', $('.delegateDetailsEdit').attr("data-specificid"))
  data.append('UserId', userId)
  data.append('firstName', firstName)
  data.append('surname', surname)
  data.append('dateOfBirth', dob)
  data.append('company', company)
  data.append('mobileNo', mobileNumber)
  data.append('emailAddress', emailAddress)
  data.append('docName',photoKey )
  data.append('idCheck',idCheck)
  data.append('idDigits', idDigits)
  data.append('CourseOverall',JSON.stringify(courseArray))
  $.ajax({
             url:'/delegatesUpdateWithImage',
             type: 'POST',
             contentType: false,
             processData: false,
             cache: false,
             data: data,
             error: function(){
                 alert('Error: Document could not be uploaded, please try again');
             },
             complete: function(){
               delegateUpdate("Updated")
               detailsUpdate($(".clickedBooking"))
               setTimeout(function(){
                 $(".OverlayTwo").animate({'right': '-70%'})
                 $('.OverlayTwo').removeClass("Open")
                $(".delegateForm").trigger('reset')
                $(".delegateImgTwo").css({'background-image': "url('/Images/vortalPortraitStandIn.png')"})
                $(".delegateDetailsEdit").removeAttr("data-userid")
               },100)
             }

         })
})

$(document).on("click", ".addCourseRow", function(){
  newCoureRow()
})

function newCoureRow(){
    $.get("/articles", function(data){
        let courseList = []
      $.each(data, function(){
        if( this._id == $(".matrixBody").attr('data-headerid')){
          $.each(this.Bookings, function(){
            let courseArr = []
            let startDate = this.Start
            console.log(this.Trainer);
            $.each(this.CourseInfo, function(){
              courseArr.push('<option value="'+this.Course+'">'+this.Course+'</option>')
            })
            courseList.push('<tr class="courseDetailsRow"><td><select value="" class="form-control editModeInput detailsCourse">'+courseArr.toString().replaceAll(",","")+'</select></td><td><input type="date" name="" value="'+startDate+'" class="form-control editModeInput detailsDate"></td><td><input class="form-control editModeInput detailsTrainer" type="text" name="" value="'+this.Trainer+'"></td><td><select value=" " class="form-control editModeInput detailsPassFail"><option>Select One</option><option value="Pass">Pass</option><option value="Fail">Fail</option></select></td><td><input class="form-control editModeInput detailsFailReason" type="text" name="" placeholder="Enter Reason Here"></td><td><span class="removeEditRow">Remove<span></td></tr>')

          })
        }
      })

      $(".courseInfoEditMode").append(courseList.toString().replaceAll(",",""))
    })

}

$(document).on("click", ".removeEditRow", function(){
  $(this).closest(".courseDetailsRow").remove()
})

$(document).on("click", ".saveBookingDetails", function(){
  $(".OverlayOne").removeClass("modified")
  $(".OverlayOne").animate({'right': '-70%'})
  $('.OverlayOne').removeClass("Open")
coursesList = []
let paperworkStage = ""
let registerStage = ""
let cardStage = ""
let certificateStage = ""
let invoiceNo = ""
let invoiceDate =""
let paidStage = ""
if($("#stagePaperwork").val() != $("#stagePaperwork").attr('data-originalstage')){
  paperworkStage = $("#stagePaperwork").val()
}
if($("#stageRegister").val() != $("#stageRegister").attr('data-originalstage')){
  registerStage = $("#stageRegister").val()
}
if($("#stageCards").val() != $("#stageCards").attr('data-originalstage')){
  cardStage = $("#stageCards").val()
}
if($("#stageCertificates").val() != $("#stageCertificates").attr('data-originalstage')){
  certificateStage = $("#stageCertificates").val()
}
  if($("#stageInvDate").val() != $("#stageInvDate").attr('data-originaldate')){
    invoiceNo = $("#stageInvNo").val()
    invoiceDate = $("#stageInvDate").val()
  }
  if($("#stagePaidDate").val() != $("#stagePaidDate").attr('data-originaldate')){
    paidStage = $("#stagePaidDate").val()
  }
$(".courseRowsMatrix").each(function(){
  coursesList.push({
    Course: $(this).find(".matrixCourseDesc").val(),
    BookedDelegates: $(this).find(".matrixBookedDel").val(),
    TestingType: $(this).find(".courseTestingType").val()
  })
})
$.post("/matrixBookingUpdate",{
  SelectedId: $(".matrixBody").attr("data-headerid"),
  SpecificId: $(".clickedBooking").attr("data-specificid"),
  Start: $("#matrixStart").val(),
  End: $("#matrixEnd").val(),
  El: $("#matrixStart").val().toString().replaceAll("-0","").replaceAll("-",""),
  TimeScale: $("#matrixTimeScale").val(),
  Total: $("#matrixDays").val(),
  Location: $("#matrixLocation").val(),
  SiteContact: $("#matrixSiteContact").val(),
  ContactNumber: $("#matrixContactNumber").val(),
  BatchRefNumber: $("#matrixBatchNumber").val(),
  PostTracking: $("#matrixTrackingNumber").val(),
  AwardingBody: $("#matrixAwardingBody").val(),
  SelectedCard: $("#matrixCardSelect").val(),
  Courses: coursesList,
  PaperworkStage: paperworkStage,
  RegisterStage: registerStage,
  CardStage: cardStage,
  CertStage: certificateStage,
  InvNo: invoiceNo,
  InvDate: invoiceDate,
  PaidStage: paidStage,
  User:$(".currentLoggedOn").attr('data-userfn')

}).done(function(){
delegateUpdate("Booking")
fetchReq($(".matrixBody").attr("data-headerid"))
})
})


function notesUpdates(){
$(".noteBorder").remove()
$('#note').val('')
$("#noteSeverity").val('Standard')
$.get("/articles", function(data) {
  $.each(data, function(i) {
    if($(".matrixBody").attr('data-headerid') == this._id){
      $.each(this.Notes, function(){
        if(this.Severity == "Important"){
          if(this.CreatedBy == $(".currentLoggedOn").attr('data-userfn')){
            $(".notesImportant").prepend('<div class="noteBorder"><div class="noteBubbleMe"><i class="fa-solid fa-triangle-exclamation importantNote"></i>  '+this.Note+'</div><div class="createdDetailsMe">'+this.CreatedAt+" - "+this.CreatedBy+'</div></div>')
          } else {
            $(".notesImportant").prepend('<div class="noteBorder"><div class="noteBubbleOther"><i class="fa-solid fa-triangle-exclamation importantNote"></i>  '+this.Note+'</div><div class="createdDetailsOther">'+this.CreatedAt+" - "+this.CreatedBy+'</div></div>')
          }
        } else {
          if(this.CreatedBy == $(".currentLoggedOn").attr('data-userfn')){
            $(".notesNormal").prepend('<div class="noteBorder"><div class="noteBubbleMe">'+this.Note+'</div><div class="createdDetailsMe">'+this.CreatedAt+" - "+this.CreatedBy+'</div></div>')
          } else {
            $(".notesNormal").prepend('<div class="noteBorder"><div class="noteBubbleOther">'+this.Note+'</div><div class="createdDetailsOther">'+this.CreatedAt+" - "+this.CreatedBy+'</div></div>')
          }
        }

      })
    }
  })
})
}

function delegateLoad(){
  $.ajaxSetup({
    async: false
  });
  $(".candidateItem").remove()
  $.get("/articles", function(data){
    $.each(data,function(){
      let vortexRef = this.VortexRef
      let headerId = this._id
      $.each(this.Bookings, function(i){
        let bookingRef = vortexRef+ "/" + alaphabetArray[i]
        let specificId = this._id
        $.each(this.Delegates, function(){
          let imageUrl = ""
          let courseArr = []
          if(this.ImageLocation == undefined){
            imageUrl = '/Images/vortalPortraitStandIn.png'
          } else {
            imageUrl = this.ImageLocation
          }
          if(this.Course != undefined){
            if(this.Course[0].length > 0){
              $.each(this.Course[0], function(){
                courseArr.push('<div>'+this.Course+' - '+this.PassFail+'</div>')
              })
            } else {
              courseArr.push('<div>No Course(s) Assigned</div>')
            }
          } else {
            courseArr.push('<div>No Course(s) Assigned</div>')
          }
          $('.delegatesList').append('<tr class="candidateItem" data-headerid="'+headerId+'" data-specificid="'+specificId+'" data-userid="'+this.UserId+'"><td><div class="candidatePhoto" style="background-image:url('+imageUrl+')"></div></td><td class="delegateFullName">'+this.FirstName+ ' '+ this.Surname + '</td><td>'+bookingRef+'</td><td>'+courseArr.toString().replaceAll(",","")+'</td><td><div class="candidateMoreInfo"><i class="fa-solid fa-plus"></i>More Information</div><div class="goToBooking"><i class="fas fa-directions"></i>Go to Booking</div></td></tr>')
        })
      })
    })
  })
}

$(document).on("click",".clearCandidateSearch", function(){
  $(".candidateSearchBar").val("")
  $(".candidateItem").show()
})

$(document).on("click",".candidateMoreInfo", function(){
  $(".candidateCourseInfo").remove()
  $(".overLayCandidate").animate({'right': '0'})
  $('.overLayCandidate').addClass("Open")
  let headerid = $(this).closest(".candidateItem").attr('data-headerid')
  let specificid = $(this).closest(".candidateItem").attr('data-specificid')
  let userId = $(this).closest(".candidateItem").attr('data-userid')
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == headerid){
        $.each(this.Bookings, function(){
          if(this._id == specificid){
            $.each(this.Delegates, function(){
              if(this.UserId == userId){
                console.log(this);
                let candImage = ""
                if(this.ImageLocation == undefined){
                  candImage = '/Images/vortalPortraitStandIn.png'
                } else {
                  candImage = this.ImageLocation
                }
                console.log(this.Course[0].length);
                if(this.Course == undefined || Number(this.Course[0].length) == 0){
                  $(".courseInfoCandidate").append('<tr class="candidateCourseInfo"><td colspan="6"> No Course(s) have been added</td></tr>')
                } else {
                  $.each(this.Course[0], function(){
                    let reason = ""
                    if(this.FailReason == "" || this.FailReason == undefined){
                      reason = "N/A"
                    } else {
                      reason = this.FailReason
                    }
                    $(".courseInfoCandidate").append('<tr class="candidateCourseInfo"><td>'+this.Course+'</td><td>'+new Date(this.Date).toLocaleDateString('EN-GB')+'</td><td>'+this.Trainer+'</td><td>'+this.PassFail+'</td><td>'+reason+'</td></tr>')
                  })
                }


                $(".candidateImgTwo").css('background-image', 'url(' + candImage + ')').attr('data-imgkey',this.ImageKey);
                $("#candidateFirstName").val(this.FirstName)
                $("#candidateSurname").val(this.Surname)
                $("#candidateDOB").val(this.DateOfBirth)
                $("#candidateMobileNumber").val(this.MobileNumber)
                $("#candidateEmailAddress").val(this.EmailAddress)
                $("#candidateCompany").val(this.Company)
                $("#candidateIdCheck").val(this.IdCheckType)
                $("#candidateLastDigits").val(this.idCheckDigits)
              }
            })
          }
        })
      }
    })
  })
})

$(document).on("input", ".candidateSearchBar", function(){
  let currentVal = $(this).val().toLowerCase()
  if($(this).val() == ""){
    $(".candidateItem").show()
  } else {
    $(".candidateItem").each(function(){
      if($(this).find(".delegateFullName").text().toLowerCase().search(currentVal) < 0){
        $(this).hide()
      }
    })
  }
})

$(document).on("input",".orgSearch", function(){
  let currentVal = $(this).val().toLowerCase()
  if(currentVal == ""){
    $('.orgItem').show()
  } else {
    $(".orgItem").each(function(){
      if($(this).find(".orgName").text().toLowerCase().search(currentVal) < 0){
        $(this).hide()
      }
    })
  }
})

$(document).on("input",".courseSearch", function(){
  let currentVal = $(this).val().toLowerCase()
  if(currentVal == ""){
    $('.courseItem').show()
  } else {
    $(".courseItem").each(function(){
      if($(this).find(".courseName").text().toLowerCase().search(currentVal) < 0){
        $(this).hide()
      }
    })
  }
})

$(".closeCandidate").on("click", function(){
  $(".candidateImgTwo").css('background-image', 'url("")').removeAttr('data-imgkey',this.ImageKey)
  $(".overLayCandidate").animate({'right': '-70%'})
  $('.overLayCandidate').removeClass("Open")
  $("#candidateFirstName").val("")
  $("#candidateSurname").val("")
  $("#candidateDOB").val("")
  $("#candidateMobileNumber").val("")
  $("#candidateEmailAddress").val("")
  $("#candidateCompany").val("")
  $("#candidateIdCheck").val("")
  $("#candidateLastDigits").val("")
})

function orgLoad() {
  $(".orgItem").remove()
  $.ajaxSetup({
    async: false
  });
  $.get("/companyData", function(data){
    $.each(data, function(){
      let imageUrl = ""
      if(this.ImageLocation == undefined || this.ImageLocation == ""){
        imageUrl = '/Images/VortalOrgStandIn.png'
      } else {
        imageUrl = this.ImageLocation
      }
      $(".orgList").append('<tr class="orgItem" data-orgid="'+this._id+'"><td><div class="orgPlaceHolder" style="background-image:url('+imageUrl+')"></div></td><td class="orgName">'+this.CompanyName+'</td></tr>')
    })
  })
}


$(document).on("click",".orgItem", function(){
  $('.newOrg').addClass("saveOrg").removeClass("newOrg")
  let item = this
  if($('.orgOverlay').hasClass("Open")){
    $(".orgOverlay").animate({'right': '-70%'}).delay(200).animate({'right': '0'})
    $('.orgOverlay').addClass("Open")
    setTimeout(function(){orgDetails(item)}, 400)
  } else {
    $(".orgOverlay").animate({'right': '0'})
    $('.orgOverlay').addClass("Open")
    orgDetails(item)
  }

})

function orgDetails(selected){
  console.log(selected);
  let item = ""
  if($(selected).hasClass("orgItem")){
    $(".orgOverlay").attr("data-orgid",$(selected).attr("data-orgid"))
    item = $(selected).attr('data-orgid')
  } else {
    $(".orgOverlay").attr("data-orgid",selected)
    item = selected
  }

$(".userItemOrg").remove()
$(".awardingBodiesPref").children().remove()
$(".orgAwardingBodies").children().remove()

  $.get('/courses', function(courses){
    $.each(courses, function(){
        let awardingBodies = []
      let accredTypes = []
      $.each(this.AccreditationTypes, function(){
        accredTypes.push('<option value="'+this.Description+'">'+this.Description+'</option>')
      })
      awardingBodies.push('<td>'+this.AwardingBody+'</td>')
      $(".awardingBodiesPref").append('<td><select class="form-control AccredPref" id="pref'+this.AwardingBody+'"><option value="Not Set">Not Set</option>'+accredTypes.toString().replaceAll(",","")+'</select></td>')
      $(".orgAwardingBodies").append(awardingBodies.toString().replaceAll(",",""))
    })
  })
    $(".orgCheckBox").prop('checked', false).val(false)
  $.get("/companyData", function(data){
    $.each(data, function(){
      if(this._id == item){
        console.log(this);
        let imageUrl = ""
        if(this.ImageLocation == undefined || this.ImageLocation == ""){
          imageUrl = '/Images/VortalOrgStandIn.png'
        } else {
          imageUrl = this.ImageLocation
        }
        $("#orgStatus").val(this.OrgStatus)
        $(".orgHeader").val(this.CompanyName)
        $(".orgImage").css({'background-image': 'url('+imageUrl+')'})
        $("#orgEditPostal").val(this.PostalAddress)
        $("#orgEditBilling").val(this.BillingAddress)
        $("#orgNumber").val(this.OfficeNumber)
        if(this.MarketingPref[0].Email == true){
          $("#orgMarketingEmail").prop('checked', true).val(true)
        }
        if(this.MarketingPref[0].Calls == true){
          $("#orgMarketingCalls").prop('checked', true).val(true)
        }
        if(this.MarketingPref[0].Text == true){
          $("#orgMarketingText").prop('checked', true).val(true)
        }
        if(this.CertsWithoutPayment == true){
          $("#orgAccredWPay").prop('checked',true).val(true)
        }
          $.each(this.AccreditationPref, function(){
            let pref = "#pref" + this.AwardingBody
            $(pref).val(this.Preferred)
          })
        $.each(this.User, function(){
          let checked = ""
          if(this.MainEmployee == true){
            checked = "checked"
          }
          let access = ""
          if(this.AccessToVortal == true){
            access = "checked"
          }
          $(".userDetailsList").append('<tr class="userItemOrg"><td contenteditable="true" class="fullNameOrg">'+this.FullName+'</td><td contenteditable="true" class="emailOrg" data-originalemail="'+this.EmailAddress+'">'+this.EmailAddress+'</td><td contenteditable="true" class="numberOrg">'+this.MobileNumber+'</td><td><input class="form-check-input orgCheckBox mainContactOrg" type="checkbox" value="'+this.MainEmployee+'" '+checked+'></td><td><input class="form-check-input orgCheckBox accessVortalOrg" type="checkbox"  value="'+this.AccessToVortal+'" '+access+'></td><td>'+this.VortalSite+'</td></tr>')
        })
      }
    })
  })
}


$(document).on("change", ".orgCheckBox", function(){
  if($(this).prop('checked') == true ){
    $(this).val(true)
  } else {
    $(this).val(false)
  }
})

$(".cancelOrg").on("click", function(){
  $(".orgOverlay").animate({'right': '-70%'})
  $('.orgOverlay').removeClass("Open")
})

$(document).on("input",".userItemOrg", function(){
  if(!$(this).hasClass("New")){
    $(this).addClass("Updated")
  }
})


$(document).on("click",'.saveOrg', function(){
  console.log(true);
  $.ajaxSetup({
    async: false
  });
  let accredPref = []
  if($(".orgOverlay").find(".tempUserPassword").val() != undefined && $(".orgOverlay").find(".tempUserPassword").val() == ""){
      alert("Please enter temporary passwords for the user")
  } else {
    $(".awardingBodiesPref").children("td").each(function(){
      let id = $(this).find(".AccredPref").attr('id')
      accredPref.push({
        AwardingBody: id.substring(4),
        Preferred: $(this).find(".AccredPref").val()
      })
    })

    $(".userItemOrg").each(function(){
      if($(this).hasClass("Updated")){
        $.post("/userUpdate", {
          SelectedId: $(".orgOverlay").attr('data-orgid'),
          OriginalEmail: $(this).find(".emailOrg").attr('data-originalemail'),
          FullName: $(this).find(".fullNameOrg").text(),
          EmailAddress: $(this).find(".emailOrg").text(),
          ContactNumber: $(this).find(".numberOrg").text(),
          MainContact: $(this).find(".mainContactOrg").val(),
          Access: $(this).find('.accessVortalOrg').val()
        })
      }
      if($(this).hasClass("New")){
        $.post("/newUser",{
          SelectedId: $(".orgOverlay").attr('data-orgid'),
          FullName: $(this).find(".fullNameOrg").text(),
          EmailAddress: $(this).find(".emailOrg").text(),
          ContactNumber: $(this).find(".numberOrg").text(),
          MainContact: $(this).find(".mainContactOrg").val(),
          Access: $(this).find('.accessVortalOrg').val()
        })
      }
    })

    $.post("/orgUpdate", {
      SelectedId: $(".orgOverlay").attr('data-orgid'),
      CompanyName:$(".orgHeader").val(),
      Status: $('#orgStatus').val(),
      Postal: $("#orgEditPostal").val(),
      Billing: $("#orgEditBilling").val(),
      ContactNumber: $("#orgNumber").val(),
      MarketEmail: $("#orgMarketingEmail").val(),
      MarketText: $("#orgMarketingText").val(),
      MarketCall: $("#orgMarketingCalls").val(),
      Accreditations: $("#orgAccredWPay").val(),
      Preferences: accredPref
    }).done(function(){
      delegateUpdate("OrgUpdate")
    })
  }

})

$(document).on("click", ".newOrg", function(){
  console.log(true);
  $.ajaxSetup({
    async: false
  });
  let accredPref = []
  if($(".orgOverlay").find(".tempUserPassword").val() != undefined && $(".orgOverlay").find(".tempUserPassword").val() == ""){
      alert("Please enter temporary passwords for the user")
  } else {
    $(".awardingBodiesPref").children("td").each(function(){
      let id = $(this).find(".AccredPref").attr('id')
      accredPref.push({
        AwardingBody: id.substring(4),
        Preferred: $(this).find(".AccredPref").val()
      })
    })
    $.post("/newOrgAdded", {
      SelectedId: $(".orgOverlay").attr('data-orgid'),
      CompanyName:$(".orgHeader").val(),
      Status: $('#orgStatus').val(),
      Postal: $("#orgEditPostal").val(),
      Billing: $("#orgEditBilling").val(),
      ContactNumber: $("#orgNumber").val(),
      MarketEmail: $("#orgMarketingEmail").val(),
      MarketText: $("#orgMarketingText").val(),
      MarketCall: $("#orgMarketingCalls").val(),
      Accreditations: $("#orgAccredWPay").val(),
      Preferences: accredPref
    }).done(function(result){
      $(".orgOverlay").attr('data-orgid', result)
      orgDetails(result)
      delegateUpdate("OrgAdded")
    })
  }
})

$(document).on('click',".newUser" ,function(){
  $(".userDetailsList").append('<tr class="userItemOrg New"><td contenteditable="true" class="fullNameOrg"></td><td contenteditable="true" class="emailOrg"></td><td contenteditable="true" class="numberOrg"></td><td><input class="form-check-input orgCheckBox mainContactOrg" type="checkbox" value=""></td><td><input class="form-check-input orgCheckBox accessVortalOrg" type="checkbox"  value=""></td><td><input type="text" name="" value="" placeholder="Temp Password" class="tempUserPassword form-control"><button type="button" name="button" class="btn btn-danger removeUserLine"><i class="fas fa-minus"></i>  New Employee</button></td></tr>')

})

$(document).on("click",".removeUserLine", function(){
  $(this).closest('.userItemOrg').remove()
})

$(document).on("click", ".addNewOrgs", function(){
  $(".orgAwardingBodies").children().remove()
  $(".awardingBodiesPref").children().remove()
  $.get('/courses', function(courses){
    $.each(courses, function(){
        let awardingBodies = []
      let accredTypes = []
      $.each(this.AccreditationTypes, function(){
        accredTypes.push('<option value="'+this.Description+'">'+this.Description+'</option>')
      })
      awardingBodies.push('<td>'+this.AwardingBody+'</td>')
      $(".awardingBodiesPref").append('<td><select class="form-control AccredPref" id="pref'+this.AwardingBody+'"><option value="Not Set">Not Set</option>'+accredTypes.toString().replaceAll(",","")+'</select></td>')
      $(".orgAwardingBodies").append(awardingBodies.toString().replaceAll(",",""))
    })
  })
  $('.saveOrg').addClass("newOrg").removeClass("saveOrg")
  $('.orgOverlay').attr('data-orgid','')
  $('.userItemOrg').remove()
  $(".orgOverlay").animate({'right': '0'})
  $('.orgOverlay').addClass("Open")
  $('.orgOverlay').find('input').val('')
  $('.orgOverlay').find(".orgCheckBox").prop('checked',false).val(false)
  $('.orgOverlay').find('select').prop('selectedIndex',0)
  $(".newUser").hide()
  $('.orgUserDetails').hide()
  $(".employeeHeader").hide()

})


function courseLoad() {
  $(".awardingBodyList").remove()
  $(".awardingBodyItem").remove()
  $.get("/courses", function(data){
    $.each(data, function(){
      let awardingBody = this.AwardingBody
      let appendTo = '.list'+awardingBody
      let card = ""
      let cert = ""
      let paperwork =""
      if(this.Cards == "Yes"){
        card = '<i class="far fa-check-circle"></i>'
      } else {
        card = '<i class="far fa-times-circle"></i>'
      }
      if(this.Certs == "Yes"){
        cert = '<i class="far fa-check-circle"></i>'
      } else {
        cert = '<i class="far fa-times-circle"></i>'
      }
      if(this.Paperwork == "Yes"){
        paperwork = '<i class="far fa-check-circle"></i>'
      } else {
        paperwork = '<i class="far fa-times-circle"></i>'
      }
      let acType = []
      $.each(this.AccreditationTypes, function(){
        acType.push('<li>'+this.Description+'</li>')
      })
      $(".selectOneAwardingBody").after('<option class="awardingBodyItem" value="'+awardingBody+'">'+awardingBody+'</option>')
      $(".courseDetailsList").append('<div class="awardingBodyList list'+this.AwardingBody+'"><div>'+this.AwardingBody+'</div><div class="acceptedIdea"><div>Cards '+card+'</div><div>Certs ' + cert +'</div><div> Paperwork ' +paperwork+'</div></div><div class="accTypes"> Accredidation Type(s) ' + acType.toString().replaceAll(",","")+'</div><div>')
      $.each(this.Courses, function(){
        $(appendTo).append('<div class="courseItem"><li class="courseName">'+this.Course+'</li><li>'+this.Description+'</li><li>Avg Duration: '+this.Duration+'</li><div>')
      })
    })
  })
}

$(document).on('click','.addCourseItem', function(){
  $(".courseOverlay").animate({'right': '0'})
  $('.courseOverlay').addClass("Open")
})


$(document).on('change',".awardingBodySelect", function(){
  $(".courseListItem").remove()
  $(".accredTyping").remove()
  $("#awardingBodyPaperwork").prop('checked',false).val("No")
  $("#awardingBodyCerts").prop('checked',false).val("No")
  $("#awardingBodyCards").prop('checked',false).val("No")
  if($(this).val() == "Other"){
    $(".awardingBodyInput").slideDown()
    $(".accredTypesCourses").append('<div class="accredTyping"><div class="col-sm-8"><input type="text" name="" value="" class="form-control" placeholder="Enter Type Here.. (e.g NPORS/CSCS)"></div><div class="removeAccredType"><i class="fa-solid fa-minus"></i> Remove</div></div>')
  } else {
    $(".awardingBodyInput").slideUp()
    $.get("/courses", function(data){
      $.each(data, function(){
        if(this.AwardingBody == $(".awardingBodySelect").val()){
          if(this.Cards == "Yes"){
            $("#awardingBodyCards").prop('checked',true).val("Yes")
          } else {
            $("#awardingBodyCards").prop('checked',false).val("No")
          }
          if(this.Certs == "Yes"){
            $("#awardingBodyCerts").prop('checked',true).val("Yes")
          } else {
            $("#awardingBodyCerts").prop('checked',false).val("No")
          }
          if(this.Paperwork == "Yes"){
            $("#awardingBodyPaperwork").prop('checked',true).val("Yes")
          } else {
            $("#awardingBodyPaperwork").prop('checked',false).val("No")
          }
          $.each(this.AccreditationTypes, function(){
            $(".accredTypesCourses").append('<div class="accredTyping"><div class="col-sm-8"><input type="text" name="" value="'+this.Description+'" class="form-control"></div><div class="removeAccredType"><i class="fa-solid fa-minus"></i> Remove</div></div>')
          })
          $.each(this.Courses, function(){
            $(".editCoursesList").append('<div class="courseListItem" data-oriinalcourse="'+this.Course+'"><h6>Course</h6><div class="courseName"><input type="text" name="" value="'+this.Course+'" class="form-control"></div><h6>Description</h6><div class="courseDesc"><input type="text" name="" value="'+this.Description+'" class="form-control"></div><h6>Avg Course Length</h6><div class="courseAverageDays"><div class="col-sm-4"><input type="number" name="" value="'+this.Duration+'" class="form-control"></div> </div></div>')
          })
        }
      })
    })
  }
})


$(document).on("click",'.addCourseDetails' ,function(){
  $(".editCoursesList").find(".coursesHeaderDesc").after('<div class="courseListItem Pending hidden"><h6>Course</h6><div class="courseName"><input type="text" name="" value="" class="form-control" placeholder="Course Name (inc any codes)"></div><h6>Description</h6><div class="courseDesc"><input type="text" name="" value="" class="form-control" placeholder="Description/Content"></div><h6>Avg Course Length</h6><div class="courseAverageDays"><div class="col-sm-4"><input type="number" name="" value="" class="form-control" placeholder="Average Days"></div> </div></div>')
  $(".courseListItem").each(function(){
    if($(this).hasClass('hidden') == true){
      $(this).slideDown()
    }
  })
})

$(document).on("change",".courseName, .courseAverageDays, .courseDesc",function(){
  if($(this).closest('.courseListItem').hasClass("Pending") ){
    if($(this).children('input').val() == ""){
      $(this).closest('.courseListItem').removeClass("New")
    } else {
      $(this).closest('.courseListItem').addClass("New")
    }

  } else {
    $(this).closest('.courseListItem').addClass("Updated")
  }
})

$(document).on("click", '.addAccred', function(){
  $(".accredTypesCourses").find('h6').after('<div class="accredTyping"><div class="col-sm-8"><input type="text" name="" value="" class="form-control"></div><div class="removeAccredType"><i class="fa-solid fa-minus"></i> Remove</div></div>')

})

$(document).on("click",".cancelCourseChange", function(){
  $(".courseOverlay").animate({'right': '-30%'})
  $('.courseOverlay').removeClass("Open")
  $(".awardingBodySelect").prop('selectedIndex',0)
  $(".courseListItem").remove()
  $(".accredTyping").remove()
  $("#awardingBodyPaperwork").prop('checked',false).val("No")
  $("#awardingBodyCerts").prop('checked',false).val("No")
  $("#awardingBodyCards").prop('checked',false).val("No")
})

$(document).on("click",".removeAccredType", function(){
  $(this).closest(".accredTyping").remove()
})

$(document).on("click",".accredCheckBox", function(){
  if($(this).prop('checked') == true){
    $(this).val("Yes")
  } else {
    $(this).val("No")
  }
})

$(document).on("click",".submitCourseChanges", function(){
  let accredType = []
  let newCourses = []

  $(".courseListItem").each(function(){
    if($(this).hasClass("New") == true){
      newCourses.push({
            Course: $(this).find(".courseName").children(".form-control").val(),
              Description: $(this).find(".courseDesc").children(".form-control").val(),
              Duration: $(this).find(".courseAverageDays").find(".form-control").val()
            })
    }
  })

  $(".accredTyping").each(function(){
    accredType.push({Description:$(this).find('.form-control').val()})
  })
  console.log(accredType);
  if($(".awardingBodySelect").val() == "Other"){
    $.post("/newAwardingBody", {
      AwardingBody: $(".awardingBodyInput").val(),
      Cards: $("#awardingBodyCards").val(),
      Certs: $("#awardingBodyCerts").val(),
      Paperwork: $("#awardingBodyPaperwork").val(),
      AccredTypes: accredType,
      Courses: newCourses
    }).done(function(){delegateUpdate("CourseUpdate")})
  } else {
    console.log(accredType);
    $.post("/courseUpdate", {
      AwardingBody: $(".awardingBodySelect").val(),
      Cards: $("#awardingBodyCards").val(),
      Certs: $("#awardingBodyCerts").val(),
      Paperwork: $("#awardingBodyPaperwork").val(),
      AccredTypes: accredType
    }).done(function(){
      $(".courseListItem").each(function(){
        switch (true) {
          case $(this).hasClass("Updated"): $.post("/individualCourseUpdate", {
            AwardingBody: $(".awardingBodySelect").val(),
            Original: $(this).attr("data-oriinalcourse"),
            Course: $(this).find(".courseName").children(".form-control").val(),
            Description: $(this).find(".courseDesc").children(".form-control").val(),
            Length: $(this).find(".courseAverageDays").find(".form-control").val()
          })

            break;
          case $(this).hasClass("New"):$.post("/additionalCourse", {
            AwardingBody: $(".awardingBodySelect").val(),
            Course: $(this).find(".courseName").children(".form-control").val(),
            Description: $(this).find(".courseDesc").children(".form-control").val(),
            Length: $(this).find(".courseAverageDays").find(".form-control").val()
          })

            break;

        }
      }).promise().done(function(){delegateUpdate("CourseUpdate")})
    })

  }
})

$(document).on("change", ".invoiceUpdates", function(){
  $(".saveInvoiceUpdates").removeClass("disabled")
})

$(document).on("click", ".saveInvoiceUpdates", function(){
  $.post("/invoiceUpdates", {
    User: $(".currentLoggedOn").attr("data-userfn"),
    StandardId: $(".matrixBody").attr("data-headerid"),
    SpecificId: $(".itemBooking").eq(0).attr("data-specificid"),
    InvoiceNumber: $("#matrixQuickInvoice").val(),
    InvoiceDate: $("#matrixQuickInvoiceDate").val(),
    PaidDate: $("#matrixQuickPaid").val()
  }).done(function(){
    delegateUpdate("Booking")
    fetchReq($(".matrixBody").attr("data-headerid"))
  })
})

$(document).on("click", ".delegateImg", function(){
  console.log("clicked");
  let image = $(this).css("background-image").toString().replace('url("', "").replace('")',"")
  localStorage.setItem("image",image)
  console.log(localStorage);
  $(".flex-container").append("<a href="+image+" class='imagePlaceholder' download='test.jpeg'>")
  $(".imagePlaceholder")[0].click()
})
