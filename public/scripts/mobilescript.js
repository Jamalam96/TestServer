// Copied from main site

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

$(document).on("change", "#start_date", function(){
  $("#end_date").val($(this).val())
  $(this).parent().parent().children().children("#total").val(1)
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
  let lastDay = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).toISOString().substr(0,10)

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
  itemMovement(firstDay, lastDay)
  $(".hide").hide()
};

/////////////////////////////

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

function itemMovement(firstDay, lastDay) {
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
        };

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
      specificDetails()
    }
  })
}

function insertAbove(arrayObjId,firstItem, index){
  let eachDiary = $(".diaryBody").find("[data-objid='"+arrayObjId[index]+"']")
    for(e = 0; e <= eachDiary.length; e++){
      let thisIndex = $(eachDiary).eq(e).index()
      let difference =  Number(firstItem) - Number(thisIndex)
      if(thisIndex != firstItem){
        if(difference > 0){
                    if($(eachDiary).eq(e).next().hasClass("firstItem") && !$(eachDiary).eq(e).hasClass("firstItem")){
                      for(t = 0; t<= difference; t++){
                        $(eachDiary).eq(e).before($(eachDiary).eq(e).next())
                      };
                    }
                  }
      }
      if(e == eachDiary.length){
        return true
      }
    }
}


$(document).on("click", ".submitNewOrg", function() {
  $(this).closest(".newOrgbody").after("<h2 class='statusText'>Uploading..</h2>")

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
  setTimeout(function(){

    $.post("/organisationData",

      {
        postReqOrgTitle: newOrgName,
        postReqOrgPostal: newOrgPostal,
        postReqOrgBilling: newOrgBilling,
        postReqOrgUsers: newOrgBookers

      },
      function(data, status) {
        console.log(status);
      }).done(function(){
        console.log("complete");
        $(".statusText").remove()
        $(".newOrgSelectInput").val(newOrgName)
        $(".newOrgSelect").children().remove()
        addFormData()
        orgSelected()
        $(".stepOne").children(".stepBody").slideDown()
        $(".newOrgbody").slideUp()
      });
  },300)

})


document.onload = addOneMonth(+0)

/////////////////

document.onload = addFormData()
document.onload = todayJob()
document.onload = openJob()

$(document).on("change", "#status", function() {

  $("#title").trigger("reset")
  if ($("#status").val() == "Holiday" || $("#status").val() == "Appointment") {
    $("#title").val($("#status").val())
  } else {
    $.get("/articles", function(data) {
      var itemCount = 0

      $.each(data, function(i) {

        if (data[i].VortexRef.startsWith("VB")) {
          itemCount++
        }
      })
      let location = Number(itemCount)
      let nextRef = Number(location) + 1
      let vortexRef = "VB-" + (nextRef + '').padStart(4, "0")
      $("#title").val(vortexRef)
    })
    console.log($("#title").val());
  }
})

function addFormData() {
  var orgarray = []
  $.get("/courses", function(data) {
    $.each(data, function(i) {
      let awardingBody = data[i].AwardingBody
      $(".awardingBody").append('<option value="' + awardingBody + '">' + awardingBody + '</option>')
    })
  })

  $.get("/CompanyData", function(data) {
    $.each(data, function(i) {
      let orgs = data[i].CompanyName
      orgarray.push(orgs)
      $.each(data[i].User, function(t) {
        if (data[i].User[t].TrainerForVortex == true) {
          let trainer = data[i].User[t].FullName
          $("#newtrainerSelect").append('<option value="' + trainer + '">' + trainer + '</option>')
          $("#edittrainerSelect").append('<option value="' + trainer + '">' + trainer + '</option>')
          $("#updateTrainerSelect").append('<option value="' + trainer + '">' + trainer + '</option>')
          $("#holOrAppointTrainer").append('<option value="' + trainer + '">' + trainer + '</option>')

        }
      });
    })
    $.each(orgarray, function(i) {
      let individualOrg = orgarray[i]
      $("#newOrgSelect").append('<option value="' + individualOrg + '">' + individualOrg + '</option>')
    })
  })
}

$(document).on("change blur", "#newOrgSelectInput", function(){
  orgSelected()
  $(this).next("select").focus()
})

function orgSelected() {
  $("#newBookerSelect").children().remove()
  $("#newBookerSelect").append('<option value="">Select One</option>')
  let courseArry = []
  $.get("/CompanyData", function(data) {
    $.each(data, function(i) {
      let orgs = data[i]
      if (orgs.CompanyName == $("#newOrgSelectInput").val()) {
        let org = orgs.User
        $.each(org, function(t) {
          $(".newBookerSelect").append('<option value="' + this.FullName + '">' + this.FullName + '</option>');
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
  console.log($(".bRow").length);
  $(".bookingRow").clone().removeClass("bookingRow").addClass("bRow").appendTo(".courseBookings").append('<button type="button" name="button" class="btn btn-info removeRow">Remove Booking</button></span>').find("#coursePickerInput").attr('list','coursePicker' + $(".bRow").length).closest(".bRow").find("#coursePicker").attr('id','coursePicker' + $(".bRow").length).closest(".bRow").find("h1").text("Booking " + $(".bRow").length)
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

$(document).on("change", "#awardingBody", function() {
  let current = this
  let currentVal = $(this).val()
  let parentVar = $(this).parent().parent().parent()
  $(parentVar).find(".courseOption").remove()
  $(this).closest(".input-group").find("#cardReq").children().remove()
  switch ($(this).val()) {
    case "NPORS":
      $(this).closest(".input-group").find("#cardReq").append('<option value="NPORS">NPORS</option><option value="NPORS/CSCS">NPORS/CSCS</option>')
      $(this).closest(".bRow").find('.testType').removeClass('hidden')
      break;
    case "EUSR":
    console.log();
      $(this).closest(".input-group").find("#cardReq").append('<option value="EUSR">EUSR</option>')
      $(this).closest(".bRow").find('.testType').addClass('hidden')

      break;

  }

  $.get("/courses", function(data) {
    let mainLookup = data
    $(current).closest(".bRow").find(".coursePicker").children().remove()
    $.each(mainLookup, function(i) {
      console.log(currentVal);
      if (this.AwardingBody == currentVal) {
        let awardingBodyVar = mainLookup[i].Courses
        $.each(this.Courses, function() {
          let course = this.Course
          $(current).closest(".bRow").find(".coursePicker").append('<option value="' + course + '" class="courseOption">' + course + '</option>');
        })
      }
    })
  })
})

$(document).on("click", ".addcourseRowEditMode", function(){
  let clone = $(this).closest(".editModeCourses").clone()
  $(this).closest(".editModeCourses").after(clone)
  $(this).closest(".editModeCourses").next(".editModeCourses").find(".addcourseRowEditMode").text("-").removeClass("addcourseRowEditMode").addClass("removecourseRowEditMode").css("padding", "0 0.5rem")
})

$(document).on("click",".removecourseRowEditMode", function(){
  $(this).closest(".editModeCourses").remove()
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

$(document).on("input","#totalBooking", function(){
  $(this).addClass("overwritten")
  $(".overwrittenUndo").removeClass("hidden")
})

$(document).on("click",".overwrittenUndo", function(){
  $(this).addClass("hidden")
$(this).closest(".bRow").find("#totalBooking").removeClass("overwritten")

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
      totalForBooking.val(dayRateCalc + cardRateCalc)
  } else {
    let ratesCalc = Number(cardRate) + Number(rateCalc)
    let candRateCalc = Number(bookedTotal * ratesCalc)
    totalForBooking.val(candRateCalc)
  }

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
  if(!$(totalForBooking).hasClass("overwritten")){
    if (selectedType == "Day Rate") {
      let dayRateCalc = Number(totalDaysCalc * rateCalc)
      let cardRateCalc = Number(bookedTotal * cardRate)
        totalForBooking.val(dayRateCalc + cardRateCalc)

    } else {
      let ratesCalc = Number(cardRate) + Number(rateCalc)
      let candRateCalc = Number(bookedTotal * ratesCalc)
      totalForBooking.val(candRateCalc)
    }
  }
  let totalForAll = 0
  $(".totalBooking").each(function() {

    totalForAll += Number($(this).val())

    ;
  });

  $("#overallTotal").val(totalForAll)
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
  console.log(bookingsArray);
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

$(document).on("click", ".nextStage", function() {
  $(".newOrgbody").slideUp()
  let org = $(".newOrgSelectInput").val()
  let booker = $("#newBookerSelect").val()
  let email = $("#bookerEmail").val()
      $(".detailsOverall").remove()
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
      let courseArr = []
      $(this).find(".rowCT").each(function() {
        let courses = $(this).find("#coursePickerInput").val()
        let nporsTesting = $(this).find("#levelPicker").val()
        let delegates = $(this).find("#bookedDelegates").val()
        if (awardingBody == "NPORS") {
          courseArr.push("<div class='detailsCourses'><li> Course:" + courses + "  -  Testing Type:" + nporsTesting + "  -  Delegates Booked: " + delegates + "</li></div>")
        } else {
          courseArr.push("<div class='detailsCourses'><li> Course:" + courses + "  -  Delegates Booked: " + delegates + "</li></div>")
        }

      });
      $(".detailsMain").after("<div class='flexRow detailsOverall'><div class='detailsBooking'><li> Full Day/AM/PM: " + timeScale + "</li><li>  Start Date: " + start + " - End Date:" + end + " - Total Days: " + totalDays + "</li><li>Trainer: " + trainer + "</li><li>Site Location: " + location + "</li><li>Site Contact: " + contact + "  -  Contact Number: " + contactNumber + "</li><li>Awarding Body: " + awardingBody + "  -  Cards Req: " + cardSelection + "</li></div><div class='detailsRates'><li>Rate Type: " + rateType + "</li><li>Course Rate:£ " + rate + "</li><li>Card Rate:£ " + cardRate + "</li><li>Course Total:£ " + bookingTotal + "</li></div>"+courseArr.toString().replaceAll(",","")+"</div>" )

    })


    if ($(".trainerOnly").val() == "true") {
      $(".detailsTO").text("Trainer Only")
    } else {
      $(".detailsTO").text("")
    }
    $(".detailsOrg").text(org)
    $(".detailsBooker").text(booker)
    $(".detailsEmail").text(email)


})

$(document).on("change", "#status", function() {
  $(".confirmBooking").prop('disabled', false)
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


/////////////////////////
$(document).on("click", ".addcourseRow", function() {
  console.log(true);
  $(this).closest("rowCT").clone().insertAfter($(this).closest("rowCT")).removeClass("rowOne")
  $(".rowCT").each(function(i) {
    switch ($(this).hasClass("rowOne")) {
      case false:
        $(this).find(".addRowContainer").text("-").removeClass("addcourseRow").addClass("removecourseRow").css("padding", "0 0.5rem")
        break;
    }
  })
})


function newFormSubmission() {
  const getRanHex = size => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
  }

  var bookingsArray = []

  $(".bRow").each(function() {
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
      Paperwork:[{'Stage':'Pending'}],
      Register:[{'Stage':'Pending'}],
      Cards:[{'Stage':'Pending'}],
      Certs:[{'Stage':'Pending'}],
      Invoice:[{'Stage':'Pending'}],
      Paid:[{'Stage':'Pending'}],
      Delegates:[]
    })
  })

setTimeout(function(){

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
        postStatus: $("#status").val()
      },
      function(data, status) {
        console.log(status);
      }).done(function(){
        $(".formPartFour").find(".Uploading").addClass("hidden")
        $(".formPartFour").find(".complete").removeClass("hidden")
        addOneMonth(+0)
        openJob()
        todayJob()

      });
  }

},1000)



}


// END OF COPY
$(".imageMenu").on("click", function(){
  if($(this).hasClass("switch")){
    $(this).animate(
      { deg: 0 },
      {
        duration: 500,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );
    $(".menuSlide").animate({'bottom': '-20rem'},500)
    setTimeout(function(){$(".menuSlide").addClass('hidden')},550)
    $(this).removeClass("switch")
  } else {
    $(this).addClass("switch")

    $(this).animate(
      { deg: 275 },
      {
        duration: 500,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );

    $(".menuSlide").removeClass('hidden').animate({'bottom': '10rem'},500)
  }

})

$(".diarySwipe").on("click", function(){
  $(".diaryPage").show().animate({"top": '0'}, 600)
  $(".footer").animate({"bottom": '-20rem'}, 600)
  $(".mobileFooter").show(600)
  $(".todayJobsNumber").remove()
  $(".openJobsNumber").remove()
})


$(document).on("click", ".landingButton", function(){
  switch ($(this).text()) {
    case "New Booking":       $(".newBooking").show(10)
          $(".newBooking").animate({'top': '30%'}, 400)

      break;
      case "Today":
      $(".todayJob").show(10)
      $(".todayJob").animate({'top': '30%'}, 400)
        break;
      case "Open Job(s)":
      $(".openJob").show(10)
      $(".openJob").animate({'top': '30%'}, 400)
  }
})
$(document).on("click", ".msButton", function(){
  switch (true) {
    case $(this).hasClass("msNew"):
      console.log(true);
         $(".newBooking").show(10)
          $(".newBooking").animate({'top': '30%'}, 400)

      break;
      case $(this).hasClass("msToday"):
      $(".todayJob").show(10)
      $(".todayJob").animate({'top': '30%'}, 400)
        break;
      case $(this).hasClass("msOpen"):
      $(".openJob").show(10)
      $(".openJob").animate({'top': '30%'}, 400)
      case $(this).hasClass("msMonth"):$(".grid").removeClass("dayView")
      $(".gridheaders").show()
      addOneMonth(+0)

        break;
  }
})

function todayJob(){
  $(".todayJobsNumber").remove()
                $(".todayCourse").remove()
               $.get("/articles", function(data){
                 $.each(data, function(){
                   let bookingRef = this.VortexRef
                   let entryCode = this.EntryCode
                   let org = this.Organisation
                   let selectedId = this._id
                   $.each(this.Bookings, function(i){
                     let start = this.Start
                     let totalDays = this.TotalDays
                     let jobdays = []
                     for(i = 0; i<= totalDays-1; i++){
                       let dateNew = new Date(Date.parse(start))
                       let intDate = dateNew.setDate(dateNew.getDate() + i)
                       let nextDay = new Date(intDate)
                       let nextEnd = nextDay.toISOString().substr(0, 10).replaceAll("-0","").replaceAll("-","")
                       jobdays.push(Number(nextEnd))
                     }
                     let today = new Date().toISOString().substr(0, 10).replaceAll("-0","").replaceAll("-","")
                     if($.inArray(Number(today),jobdays)  != -1 && this.Trainer == $(".currentUser").attr("data-currentuser")){
                       let courseArray = []
                       $.each(this.CourseInfo, function(){
                         if(this.TestingType == 'NPORS Testing Type'){
                           courseArray.push('<li> Course: '+this.Course+' - ' + this.BookedDelegates + ' Delegates</li>')
                         } else {
                           courseArray.push('<li> Course: '+ this.Course+' - ' + this.TestingType+ ' - ' + this.BookedDelegates + ' Delegates</li>')
                         }

                       })
                       let latestStage = Number(this.TrainerStage.length)-1
                       let courseButton = ""
                       let openedDetails = ""

                       $.each(this.TrainerStage, function(){
                         if(this.Stage == "Open"){
                           openedDetails = "<li>" + this.User + " - "+ this.TimeStamp+ "</li>"
                         }
                       })
                       switch (this.TrainerStage[latestStage].Stage) {
                         case "New": courseButton = '<button type="button" name="button" class="courseStage"> Open Course</button>'
                           break;
                         case "Open": courseButton = '<div class="jobStages"> <div><em> Opened<em> '+openedDetails+' </div><div> Register - Not Started </div><div>Paperwork - Not Started</div><div>Approval - N/A</div></div><div><button type="button" name="button" class="registerOpen">Register</button></div>'

                           break;
                       }
                       $(".todayScroll").append('<div class="todayCourse" data-headerid="'+selectedId+'" data-objid='+this._id+'><h1>'+bookingRef+'</h1><div class="todayBasicInfo"><li>'+org+'</li><li>'+this.AwardingBody+' - Cards Requested: '+this.CardsIncluded+ '</li></div><div><li>Site Location: '+this.SiteLocation+'</li><li>Site Contact: '+this.SiteContact +' - '+ this.SiteContactNumber +'</li></div><div><li>Dates: '+ new Date(this.Start).toLocaleDateString("en-gb")+' - '+ new Date(this.End).toLocaleDateString("en-gb")+'</li></div><div>'+courseArray.toString().replaceAll(",","")+'</div><div class="signOn"> Entry Link: www.vortalplus.co.uk/course/'+bookingRef+' - Entry Code: '+entryCode+'</div><div> Current Stage: ' + this.TrainerStage[latestStage].Stage+'</div><div>'+courseButton+'</div></div>')
                     }
                   })
                 })
               }).done(function(){
                       $("body").append('<span class="todayJobsNumber badge badge-pill badge-danger hidden">'+Number($(".todayScroll").children(".todayCourse").length)+'</span>')
                 if(Number($(".todayScroll").children(".todayCourse").length) > 0){
                   $(".todayJobsNumber").css({top: $(".todayJobs").offset().top - 16 , left: Number($(".todayJobs").offset().left) + Number($(".openJobs").width() -16) })
                   $(".todayJobsNumber").removeClass("hidden")
                 }
               })

}



function openJob(){
  $(".openScroll").children().remove()
  $(".openJobsNumber").remove()
  let currentUser = $(".currentUser").attr("data-currentuser")
  $.get("/articles", function(data){
    $.each(data, function(){
      let count = 0
      let selectedId = this._id
      let bookingref = this.VortexRef
      let org = this.Organisation
        $.each(this.Bookings, function(){
          let courseArray = []
          $.each(this.CourseInfo, function(){
            if(this.TestingType == 'NPORS Testing Type'){
              courseArray.push('<li> Course: '+this.Course+' - ' + this.BookedDelegates + ' Delegates</li>')
            } else {
              courseArray.push('<li> Course: '+ this.Course+' - ' + this.TestingType+ ' - ' + this.BookedDelegates + ' Delegates</li>')
            }
          })

          let latestStage = Number(this.TrainerStage.length)-1
          let courseButton = ""
          let openedDetails = ""
          let registerDetails = ""

          $.each(this.TrainerStage, function(){
            switch (this.Stage) {
              case "Open":openedDetails = "<li>" + this.User + " - "+ this.TimeStamp+ "</li>"
                break;
              case "Register Started": registerDetails = "<li> First Delegate @ - "+ this.TimeStamp+ "</li>"

                break;
                case "Results Submitted": registerDetails = "<li> Results Submitted @ - "+ this.TimeStamp+ "</li>"

                  break;

            }

          })

          switch (this.TrainerStage[latestStage].Stage) {
            case "New": courseButton = '<button type="button" name="button" class="courseStage"> Open Course</button>'
              break;
            case "Open": courseButton = '<div class="jobStages"> <div class="active"><em> Opened<em> '+openedDetails+' </div><div> Register - Not Started </div><div>Paperwork - Not Started</div><div>Approval - N/A</div></div><div><button type="button" name="button" class="registerOpen">Register</button></div>'

              break;
            case "Register Started": courseButton = '<div class="jobStages"> <div><em> Opened</em> '+openedDetails+' </div><div class="active"> <em>Register - Started</em> '+registerDetails+' </div><div>Paperwork - Not Started</div><div>Approval - N/A</div></div><div><button type="button" name="button" class="registerOpen">Register</button></div>'

              break;
              case "Results Submitted":courseButton = '<div class="jobStages"> <div><em> Opened</em> '+openedDetails+' </div><div> <em>Register - Submitted</em> '+registerDetails+' </div><div class="active">Paperwork <li> Please continue on a computer</li></div><div>Approval - N/A</div></div><div><button type="button" name="button" class="registerOpen">Register</button></div>'

                break;
          }

          if(this.Trainer == currentUser && this.TrainerStage[latestStage].Stage!= "New" && this.TrainerStage[latestStage].Stage != "Cancelled" && bookingref.startsWith("VB-")){
            $(".openScroll").append('<div class="openCourse" data-headerid="'+selectedId+'" data-objid="'+this._id+'"><h1>'+bookingref+'</h1><div class="todayBasicInfo"><li>'+org+'</li><li>'+this.AwardingBody+' - Cards Requested: '+this.CardsIncluded+ '</li></div><div><li>Site Location: '+this.SiteLocation+'</li><li>Site Contact: '+this.SiteContact +' - '+ this.SiteContactNumber +'</li></div><div><li>Dates: '+ new Date(this.Start).toLocaleDateString("en-gb")+' - '+ new Date(this.End).toLocaleDateString("en-gb")+'</li></div><div>'+courseArray.toString().replaceAll(",","")+'</div><div>'+courseButton+'</div><div>')
          }
        })
    })
  }).done(function(){
          $("body").append('<span class="openJobsNumber badge badge-pill badge-danger hidden">'+$(".openScroll").children(".openCourse").length+'</span>')
    if($(".openScroll").children(".openCourse").length > 0){
      $(".openJobsNumber").css({top: $(".openJobs").offset().top - 16 , left: Number($(".openJobs").offset().left) + Number($(".openJobs").width() - 92) })
      $(".openJobsNumber").removeClass("hidden")
    }
  })
}


$(document).on("click", ".courseStage", function(){
  let headerId = $(this).closest(".todayCourse").attr("data-headerid")
  let bookingId = $(this).closest(".todayCourse").attr("data-objid")
  $(".todayCourse").remove()
  $.post("/courseOpen",{
    selectedId: headerId,
    bookingId: bookingId,
    user: $(".currentUser").attr("data-currentuser")
  }).done( setTimeout(function(){todayJob()
  openJob()},80))
})

$(document).on("click", ".minimise", function(){
  delegateInterval("stop")
  $(this).closest(".slideBody").animate({'top': '120%'}, 400)
  let item = this
  setTimeout(function(){
    $(item).closest(".slideBody").hide(0)
    if($(item).closest(".slideBody").hasClass("newBooking")){
      $("#trainerOnly").val("false").prop('checked', false)
      $(".newBookingInner").find("select").each(function(){
        $(this).prop('selectedIndex',0)
      })
      $(".newBookingInner").find("input").each(function(){
        $(this).val('')
      })
      $(".newBookingInner").hide()
      $(".preCheck").show()
      $(".bookingTypeSelect").prop('selectedIndex',0)

      }
  },400)

})

function specificDetails() {
  $.ajaxSetup({
    async: false
  });
    $.get("/articles", function(data){
      $(".diaryItems").each(function(){
        let headerId = $(this).attr("data-headerid")
        let specificId = $(this).attr("data-objid")
        let diaryItem = this
      $.each(data, function(){
        if(this._id == headerId){
          let vRef = this.VortexRef
          let org = this.Organisation
          let bookings = this.Bookings
          let notes =this.Notes
          let noteArr = ""
          if(notes.length == 0){
            noteArr = '<li>No Notes</li>'
          } else {
            let createdBy = $(notes).last()[0].CreatedBy
            let createdAt = $(notes).last()[0].CreatedAt
            let note = $(notes).last()[0].Note
            let severity = $(notes).last()[0].Severity
            if(severity == "Important"){
              noteArr = '<li class="note">'+note+'<i class="fas fa-exclamation importantNote"></i></li> </div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
            } else {
              noteArr = '<li class="note">'+note+'</li></div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
            }
          }
          $.each(bookings, function(){
            if(this._id == specificId){
              let notification = ""
              switch (this.NPORSNotification) {
                case "Internal":notification = '<i class="fas fa-check-square internalNotification"></i>'

                  break;

                case "External": notification = '<i class="fas fa-check-square externalNotification"></i>'

                  break;
                default: notification = ""

              }

              let courses = []
              $.each(this.CourseInfo, function(){
                if(this.TestingType == "NPORS Testing Type"){
                  let courseDetails = '<li>Course: ' + this.Course+' - Delegates: ' +this.BookedDelegates+' </li>'
                  courses.push(courseDetails)
                } else {
                  let courseDetails = '<li>Course: ' + this.Course+' - Delegates: ' +this.BookedDelegates+' - Type: ' +this.TestingType +' </li>'
                  courses.push(courseDetails)
                  notification
                }
              })
              let stage = this.TrainerStage[this.TrainerStage.length - 1].Stage
              switch (stage) {
                case "Cancelled":                $(diaryItem).prepend('<div class="specificDetails hidden"><div class="sdHead"><div>'+vRef+notification+'</div><div>'+new Date(this.Start).toLocaleDateString("en-gb") + ' - ' + new Date(this.End).toLocaleDateString("en-gb")+'</div><div> Trainer: '+this.Trainer+'</div><div>'+org+'</div></div><div class="sdBody"><div> Location: '+this.SiteLocation+'</div><div> Contact: '+this.SiteContact+' - '+ this.SiteContactNumber+'</div><div> Awarding Body: '+this.AwardingBody+ ' - Cards Requested: '+this.CardsIncluded+ '</div><div>'+courses.toString().replaceAll(",","")+'</div></div><div class="sdNotes"><h2>Latest Note</h2><div>'+noteArr.toString().replaceAll(",","")+'</div></div><div class="taskButtons"><div><button type="button" name="button" class="btn btn-success spTaskButton"> Edit Course</button></div><div><button type="button" name="button" class="btn btn-info spTaskButton"> Add Note</button></div></div></div>')


                  break;
                  case "Pending":                $(diaryItem).prepend('<div class="specificDetails hidden"><div class="sdHead"><div>'+vRef+notification+'</div><div>'+new Date(this.Start).toLocaleDateString("en-gb") + ' - ' + new Date(this.End).toLocaleDateString("en-gb")+'</div><div> Trainer: '+this.Trainer+'</div><div>'+org+'</div></div><div class="sdBody"><div> Location: '+this.SiteLocation+'</div><div> Contact: '+this.SiteContact+' - '+ this.SiteContactNumber+'</div><div> Awarding Body: '+this.AwardingBody+ ' - Cards Requested: '+this.CardsIncluded+ '</div><div>'+courses.toString().replaceAll(",","")+'</div></div><div class="sdNotes"><h2>Latest Note</h2><div>'+noteArr.toString().replaceAll(",","")+'</div></div><div class="taskButtons"><div><button type="button" name="button" class="btn btn-success spTaskButton"> Edit Course</button></div><div><button type="button" name="button" class="btn btn-danger spTaskButton"> Cancel Course</button></div><div><button type="button" name="button" class="btn btn-info spTaskButton"> Add Note</button></div></div><div class="openToTrainer"><button type="button" name="button" class="btn btn-info spTaskButton"> Open to trainer</button></div></div>')


                    break;
                default:
                $(diaryItem).prepend('<div class="specificDetails hidden"><div class="sdHead"><div>'+vRef+notification+'</div><div>'+new Date(this.Start).toLocaleDateString("en-gb") + ' - ' + new Date(this.End).toLocaleDateString("en-gb")+'</div><div> Trainer: '+this.Trainer+'</div><div>'+org+'</div></div><div class="sdBody"><div> Location: '+this.SiteLocation+'</div><div> Contact: '+this.SiteContact+' - '+ this.SiteContactNumber+'</div><div> Awarding Body: '+this.AwardingBody+ ' - Cards Requested: '+this.CardsIncluded+ '</div><div>'+courses.toString().replaceAll(",","")+'</div></div><div class="sdNotes"><h2>Latest Note</h2><div>'+noteArr.toString().replaceAll(",","")+'</div></div><div class="taskButtons"><div><button type="button" name="button" class="btn btn-success spTaskButton"> Edit Course</button></div><div><button type="button" name="button" class="btn btn-danger spTaskButton"> Cancel Course</button></div><div><button type="button" name="button" class="btn btn-info spTaskButton"> Add Note</button></div></div></div>')


              }
            }
          })
        }
      })
    })
  })

}


$(document).on("click", ".item", function(e){
  console.log(e);
  if(!$(".grid").hasClass("dayView")){
      $(".grid").addClass("dayView")

let diary = this
 dayViewSort()
setTimeout(function(){
$('.bodyMain').animate({
                 scrollTop: $(diary).position().top
             },300);
$(diary).css({'background-color': '#F9FFA4'})
},200)
setTimeout(function(){
  $(diary).css({'background-color': 'inherit'})
},1000)
}

})


$(document).on("click", ".fa-chevron-left , .fa-chevron-right", function(){
  dayViewSort()
})

function dayViewSort(){
  if($(".grid").hasClass("dayView")){
    $(".diaryBookingText").hide()
    $(".specificDetails").removeClass("hidden")
    $(".gridheaders").hide()
    $(".grid").addClass("dayView")
    $(".diaryPage").css({'height':'100%', 'overflow': 'hidden'})
    $(".bodyMain").css({'height': '90%'})
    $(".dateNo").addClass("dateDayView")
    $(".diaryItems").removeClass("widthx2").removeClass("widthx3").removeClass("widthx4").removeClass("widthx5").removeClass("widthx6").removeClass("widthx7").addClass("dayViewDItem")
    $(".item").addClass("dayViewItem")
    $(".item").each(function(){
      $(this).children(".spare").hide()
      let date = $(this).attr("data-datespan").split('-')
      let year = date[0]
      let month = (new Array(2).join('0')+date[1]).slice(2*-1)
      let day = (new Array(2).join('0')+date[2]).slice(2*-1)
      let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let fullDate = new Date(year + '-'+month+'-'+day)
      let specificDay = days[fullDate.getDay()]
      switch (fullDate.getDay()) {
        case 1: $(this).addClass("lastDay")
          break;
        default:
      }

      let eachDay = $(this).find(".dateNo").text()
      $(this).find(".dateNo").text(specificDay + " - " + eachDay)
      let height = ""
      if($(this).children("li").length == 0){
        height = 106
      } else {
        height = Math.floor(Number($(this).children(".diaryItems").length * 140) + (Number($(this).children(".diaryItems").length) * ($(".diaryItems").height() + 55)))
      }
      $(this).css({'height': height + "px"})
    })
  }
}




$(document).on("click", ".spTaskButton", function(){
  switch ($(this).text()) {
    case " Edit Course":
     $(this).closest(".diaryItems").animate({'height': '55vh'}, 1000)
     $(this).closest(".item").animate({'height': '60vh'}, 1000)
        $(this).closest(".item").children(".diaryItems").not($(this).closest(".diaryItems")).slideUp(900).delay(900).hide(100)
        $(this).closest(".taskButtons").slideUp()
        updateBooking($(this))
      break;
      case " Cancel Course":
      $(this).closest(".diaryItems").animate({'height': '40vh'}, 1000)
      $(this).closest(".item").animate({'height': '45vh'}, 1000)
      $(this).closest(".item").children(".diaryItems").not($(this).closest(".diaryItems")).slideUp(900).delay(900).hide(100)
      $(this).closest(".taskButtons").slideUp()
      $(this).closest(".diaryItems").append('<div class="cancelOptions hidden"> Please select which courses you would like to cancel </div><div class="cancelTasks"><div><button type="button" name="button" class="btn btn-success confirmCancellation">Confirm Cancellation</button></div><div><button type="button" name="button" class="btn btn-danger cancelCancellation">Cancel Cancellation</button></div>')
      eachBookingLine($(this).closest(".diaryItems"))
        break;
        case " Add Note":
                  $(this).closest(".diaryItems").append('<div class="overallNote"><div class="input-group newNote"><input type="text" name="" value="" class="form-control newNoteHere"><button type="button" class="btn btn-light submiteNewNote"><i class="far fa-paper-plane"></i></button><button type="button" class="btn btn-danger cancelNewNote"><i class="fas fa-ban"></i></button></div><div class="input-group newNote"><div class="input-group-prepend"><span class="input-group-text">Select Audience</span></div><select class="audienceSelect form-control"><option value="Everyone">Everyone</option><option value="officeStaffOnly">Office Staff Only</option></div></div>')
                  $(this).closest(".taskButtons").slideUp()

          break;
        case " Open to trainer":
                          let item = this
                  $.post("/openingCourses", {
                    headerId: $(this).closest(".diaryItems").attr("data-headerid"),
                    objId:$(this).closest(".diaryItems").attr("data-objid")
                  }).done(function() {$(item).closest(".diaryItems").removeClass("Pending").addClass("New")
                            $(item).closest(".diaryItems").find(".openToTrainer").remove()

                            })
                  console.log(true);

          break;
  }
})

function eachBookingLine(selected) {
  let selectedId = $(selected).attr("data-headerid")
  let specificId = $(selected).attr("data-objid")
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == selectedId){
        $.each(this.Bookings, function(){
          let id = this._id
          let courses = []
          let rate = this.Rate
          let currentStage = this.TrainerStage[this.TrainerStage.length - 1].Stage
          if(currentStage != "Cancelled"){
            $(".courseDayRate").val(rate)
            $.each(this.CourseInfo, function(){
              courses.push('<li>'+this.Course+'</li>')
            })
            if(id == specificId){
              $(selected).find(".cancelOptions").append('<div class="cancelItems"><div class="courseRow" data-objid="'+this._id+'"><div>' + new Date(this.Start).toLocaleDateString("en-gb") + ' - ' + new Date(this.End).toLocaleDateString("en-gb") + '</div><div>'+this.Trainer+'</div><div>'+courses.toString().replaceAll(",","")+'</div><div><input type="checkbox" name="toBeCancelled" value="false" id="toBeCancelled" class="form-check-input cancelCheck">Current</div></div><div class="input-group cancelReason"><select class="form-select cancellationReason" name=""> <option value="Booked In Error">Booked In Error</option> <option value="Duplication">Duplication</option> <option value="Training No Longer Required">Training No Longer Required</option> <option value="COVID">COVID</option> <option value="Trainer Could Not Attend">Trainer Could Not Attend</option> <option value="Other">Other</option> </select><div class="input-group-prepend"> <span class="input-group-text" id="basic-addon1">To Invoice?</span> </div><select class="form-select cancelRateSelect" name=""> <option value="100%">Yes - 100%</option> <option value="50%">Yes - 50%</option> <option value="Other">Yes - Other</option> <option value="No">No</option></select><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Rate</span> </div><input type="Number" name="" class="form-control cancelDayRate" value="'+rate+'" data-originalrate="'+rate+'"></div><textarea name="name" rows="2" class="cancelOtherReason form-control hidden" placeholder="Other Reason Here"></textarea></div>')
            } else {
              $(selected).find(".cancelOptions").append('<div class="cancelItems"><div class="courseRow" data-objid="'+this._id+'"><div>' + new Date(this.Start).toLocaleDateString("en-gb") + ' - ' + new Date(this.End).toLocaleDateString("en-gb") + '</div><div>'+this.Trainer+'</div><div>'+courses.toString().replaceAll(",","")+'</div><div><input type="checkbox" name="toBeCancelled" value="false" id="toBeCancelled" class="form-check-input cancelCheck"></div></div><div class="input-group cancelReason"><select class="form-select cancellationReason" name=""> <option value="Booked In Error">Booked In Error</option> <option value="Duplication">Duplication</option> <option value="Training No Longer Required">Training No Longer Required</option> <option value="COVID">COVID</option> <option value="Trainer Could Not Attend">Trainer Could Not Attend</option> <option value="Other">Other</option> </select><div class="input-group-prepend"> <span class="input-group-text" id="basic-addon1">To Invoice?</span> </div><select class="form-select cancelRateSelect" name=""> <option value="100%">Yes - 100%</option> <option value="50%">Yes - 50%</option> <option value="Other">Yes - Other</option> <option value="No">No</option></select><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Rate</span> </div><input type="Number" name="" class="form-control cancelDayRate" value="'+rate+'" data-originalrate="'+rate+'"></div><textarea name="name" rows="2" class="cancelOtherReason form-control hidden" placeholder="Other Reason Here"></textarea></div>')
            }
          }
        })
      }
    })
  }).done(function(){
    $(".cancelReason").hide()
    $(".cancelOptions").slideDown()
  })
}

function updateBooking(selected){
  let awardingBody = ''
  addFormData()
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == $(selected).closest(".diaryItems").attr("data-headerid")){
        $.each(this.Bookings, function(){
          if(this._id == $(selected).closest(".diaryItems").attr("data-objid")){
              let courseArray = []
              awardingBody = this.AwardingBody
              $.each(this.CourseInfo, function(){
                if(awardingBody == "NPORS"){
                  let courseItem = '<div class="input-group courseRows"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Course</span></div><input list="updatecoursePickerList" id="updatecoursePicker" class="updateCourseSelect form-control mobileInput" type="text" name="" value="'+this.Course+'" autocomplete="off"> <datalist class="updatecoursePickerList" id="updatecoursePickerList" autocomplete="off"> </datalist><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Delegates</span></div><div class="form-control-inline"><input type="number" name="" value="'+this.BookedDelegates+'" class="form-control input-control-adjust bookedDelUpdates" ></div><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Test Type</span></div><input type="text" name="" value="'+this.TestingType+'" class="form-control updateTesting"></div>'
                  courseArray.push(courseItem)
                } else {
                  let courseItem = '<div class="input-group courseRows"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Course</span></div><input list="updatecoursePickerList" id="updatecoursePicker" class="updateCourseSelect form-control mobileInput" type="text" name="" value="'+this.Course+'" autocomplete="off"> <datalist class="updatecoursePickerList" id="updatecoursePickerList" autocomplete="off"> </datalist><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Delegates</span></div><div class="form-control-inline"><input type="number" name="" value="'+this.BookedDelegates+'" class="form-control input-control-adjust bookedDelUpdates" ></div>'
                }

              })
            $(selected).closest(".specificDetails").after('<div class="updateBody"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Start Date</span> </div><input type="date" name="updateStart" value="'+this.Start+'" id="updateStart" class="form-control"><div class="input-group-prepend"> <span class="input-group-text" id="basic-addon1">End Date</span></div><input type="date" name="updateEnd" value="'+this.End+'" id="updateEnd" class="form-control"><select class="updateTimeScale form-select mobileInput" name="updateTimeScale" id="updateTimeScale"> <option value="FullDay">Full Day</option> <option value="AM">AM</option> <option value="PM">PM</option> </select></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Select Trainer</span> </div><select class="selectpicker form-select" name="updateTrainerSelect" id="updateTrainerSelect"> <option value="'+this.Trainer+'">'+this.Trainer+'</option></select></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Site Contact</span></div><input type="text" name="" value="'+this.SiteContact+'" class="form-control siteContact"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Contact Number</span></div><input type="text" name="" value="'+this.SiteContactNumber+'" class="form-control siteContactNumber"></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Site Location</span></div><textarea name="name" rows="3" cols="100" class="form-control siteLocation">'+this.SiteLocation+'</textarea></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Rate Type</span></div><select class="form-select mobileInput" id="updateDayOrCandidate" selected="'+this.CandidateDayRate+'"> <option>Select One</option> <option value="Day Rate">Day Rate</option> <option value="Candidate Rate">Candidate Rate</option> </select></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Rate</span></div><input type="number" name="" value="'+this.Rate+'" class="form-control updateRate"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Card Rate</span></div><input type="number" name="" value="'+this.CardRate+'" class="form-control updateCardRate"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">PO Number</span></div><input type="text" name="" value="'+this.PONumber+'" class="form-control updatePONumber"></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Awarding Body</span></div><select class="updateawardingBody form-select mobileInput" name="updateawardingBody" id="updateawardingBody"> <option>Select One</option> </select></div>'+courseArray.toString().replaceAll(",","")+'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">NPORS Notification</span><select class="notificationNpors form-control selectpicker"><option value="">Select One</option><option value="Internal">Internal</option><option value="External">External</option></select></div></div><div class="updateOptions"><div><button type="button" name="button" class="btn btn-success updateBooking">Update Course</button></div><div><button type="button" name="button" class="btn btn-danger cancelUpdate">Cancel Update</button></div></div></div>')
            $(selected).closest(".diaryItems").find("#updateDayOrCandidate").val(this.CandidateDayRate)
            $(selected).closest(".diaryItems").find(".updateTimeScale").val(this.TimeScale)
            $(selected).closest(".diaryItems").find(".notificationNpors").val(this.NPORSNotification)
          }
        })
      }
    })
  })
  $.get("/courses", function(data) {
    $.each(data, function(i) {
      let awardingBody = data[i].AwardingBody
      $(".updateawardingBody").append('<option value="' + awardingBody + '">' + awardingBody + '</option>')
    })
  })
  $(".updateawardingBody").val(awardingBody)
}

function cancelBooking(selected){
    let diaryItem = $(this).closest(".diaryItems")
    $(diaryItem).find(".cancelOptions")
}

$(document).on("click", "#updatecoursePicker", function(){
  // $(this).val('')
  $(this).parent().find(".updatecoursePickerList").children().remove()
  let selected = this
  $.get("/courses", function(data){
    $.each(data, function(){
      if(this.AwardingBody == $(selected).closest(".updateBody").find(".updateawardingBody").val()){
        $.each(this.Courses, function(){

          $(selected).parent().find(".updatecoursePickerList").append('<option value="'+this.Course+'">'+this.Course+'</option>')
        })

      }
    })

  })
})

$(document).on("click", ".cancelUpdate",function(){
  hideUpdate(this)
})

 function hideUpdate(selected){
  $(selected).closest(".updateBody").slideUp(500)
  let item = selected
  let day = $(item).closest(".item")
  $(item).closest(".diaryItems").removeAttr("style")
  $(item).closest(".item").children(".diaryItems").slideDown()
  $(item).closest(".item").find(".taskButtons").slideDown()
  $(item).closest(".item").find(".updateBody").slideUp()
  setTimeout(function(){
    $(item).closest(".updateBody").remove()

    let height = 106 + (Number($(day).children("li").length) * ($(".diaryItems").height() + 55))
    $(day).animate({'height': height + "px"},600)
  },400)
}


$(document).on("click", ".updateBooking", function(){
  $.ajaxSetup({
    async: false
  });
  let el = $(this).closest(".diaryItems").find("#updateStart").val()
  let total = ""
  let courseArr = []
  if ($(this).closest(".diaryItems").find("#updateTimeScale").val() == "FullDay") {
    let endDateCalc = new Date($(this).closest(".diaryItems").find("#updateEnd").val()).getTime()
    let startDateCalc = new Date($(this).closest(".diaryItems").find("#updateStart").val()).getTime()
    let calcTotal1 = endDateCalc - startDateCalc
    let calcTotal2 = calcTotal1 / (1000 * 3600 * 24) + 1;
    total = calcTotal2
  } else {
     total = 0.5
  }
    let courseArray = []
    $(".courseRows").each(function(){
      course = {
        Course:$(this).find("#updatecoursePicker").val(),
        BookedDelegates: $(this).find(".bookedDelUpdates").val(),
        TestingType: $(this).find(".updateTesting").val()
      }
      courseArr.push(course)
    })
    let diaryItem = this

  $.post("/jobUpdate", {
    SelectedId: $(this).closest(".diaryItems").attr("data-headerid"),
    bookingId: $(this).closest(".diaryItems").attr("data-objid"),
    StartDate: $(this).closest(".diaryItems").find("#updateStart").val(),
    EndDate: $(this).closest(".diaryItems").find("#updateEnd").val(),
    TimeScale: $(this).closest(".diaryItems").find("#updateEnd").val(),
    TotalDays: total,
    El: el.replaceAll("-0","").replaceAll("-",""),
    Trainer: $(this).closest(".diaryItems").find("#updateTrainerSelect").val(),
    SiteContact: $(this).closest(".diaryItems").find(".siteContact").val(),
    ContactNumber: $(this).closest(".diaryItems").find(".siteContactNumber").val(),
    SiteLocation: $(this).closest(".diaryItems").find(".siteLocation").val(),
    RateType: $(this).closest(".diaryItems").find("#updateDayOrCandidate").val(),
    Rate: $(this).closest(".diaryItems").find(".updateRate").val(),
    CardRate: $(this).closest(".diaryItems").find(".updateCardRate").val(),
    PONumber: $(this).closest(".diaryItems").find(".updatePONumber").val(),
    AwardingBody: $(this).closest(".diaryItems").find(".updateawardingBody").val(),
    CourseInfo: courseArr,
    notification: $(this).closest(".diaryItems").find(".notificationNpors").val()
  }).done(function(){
    console.log("Updated");
    $(diaryItem).closest(".diaryItems").append('<div class="bookingUpdatedNotification hidden"><i class="fa-regular fa-circle-check"></i></div>')
    $(diaryItem).closest(".diaryItems").children(".bookingUpdatedNotification").fadeIn(300).delay(1000).fadeOut(300)
    setTimeout(function(){
      singleCourseUpdate(diaryItem)
    },1300)
  })
})


function singleCourseUpdate(selected){
  diaryItem = $(selected).closest(".diaryItems")
  $(diaryItem).children(".bookingUpdatedNotification").remove()
  $(diaryItem).children(".updateBody").slideUp(300)
  $(diaryItem).children(".specificDetails").remove()
  $.get("/articles", function(data){
      let headerId = $(diaryItem).attr("data-headerid")
      let specificId = $(diaryItem).attr("data-objid")
    $.each(data, function(){
      if(this._id == headerId){
        let vRef = this.VortexRef
        let org = this.Organisation
        let bookings = this.Bookings
        let notes =this.Notes
        let noteArr = ""
        if(notes.length == 0){
          noteArr = '<li>No Notes</li>'
        } else {
          let createdBy = $(notes).last()[0].CreatedBy
          let createdAt = $(notes).last()[0].CreatedAt
          let note = $(notes).last()[0].Note
          let severity = $(notes).last()[0].Severity
          if(severity == "Important"){
            noteArr = '<li class="note">'+note+'<i class="fas fa-exclamation importantNote"></i></li> </div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
          } else {
            noteArr = '<li class="note">'+note+'</li></div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
          }
        }
        let notification = ""
        $.each(bookings, function(){

          switch (this.NPORSNotification) {
            case "Internal":notification = '<i class="fas fa-check-square internalNotification"></i>'

              break;

            case "External": notification = '<i class="fas fa-check-square externalNotification"></i>'

              break;
            default: notification = ""

          }
          if(this._id == specificId){
            let courses = []
            $.each(this.CourseInfo, function(){
              if(this.TestingType == "NPORS Testing Type"){
                let courseDetails = '<li>Course: ' + this.Course+' - Delegates: ' +this.BookedDelegates+' </li>'
                courses.push(courseDetails)
              } else {
                let courseDetails = '<li>Course: ' + this.Course+' - Delegates: ' +this.BookedDelegates+' - Type: ' +this.TestingType +' </li>'
                courses.push(courseDetails)
              }
            })
            let stage = this.TrainerStage[this.TrainerStage.length - 1].Stage
            if(stage != "Cancelled"){
              $(diaryItem).prepend('<div class="specificDetails"><div class="sdHead"><div>'+vRef+notification+'</div><div>'+new Date(this.Start).toLocaleDateString("en-gb") + ' - ' + new Date(this.End).toLocaleDateString("en-gb")+'</div><div> Trainer: '+this.Trainer+'</div><div>'+org+'</div></div><div class="sdBody"><div> Location: '+this.SiteLocation+'</div><div> Contact: '+this.SiteContact+' - '+ this.SiteContactNumber+'</div><div> Awarding Body: '+this.AwardingBody+ ' - Cards Requested: '+this.CardsIncluded+ '</div><div>'+courses.toString().replaceAll(",","")+'</div></div><div class="sdNotes"><h2>Latest Note</h2><div>'+noteArr.toString().replaceAll(",","")+'</div></div><div class="taskButtons"><div><button type="button" name="button" class="btn btn-success spTaskButton"> Edit Course</button></div><div><button type="button" name="button" class="btn btn-danger spTaskButton"> Cancel Course</button></div><div><button type="button" name="button" class="btn btn-info spTaskButton"> Add Note</button></div></div></div>')
            } else {
              $(diaryItem).prepend('<div class="specificDetails"><div class="sdHead"><div>'+vRef+notification+'</div><div>'+new Date(this.Start).toLocaleDateString("en-gb") + ' - ' + new Date(this.End).toLocaleDateString("en-gb")+'</div><div> Trainer: '+this.Trainer+'</div><div>'+org+'</div></div><div class="sdBody"><div> Location: '+this.SiteLocation+'</div><div> Contact: '+this.SiteContact+' - '+ this.SiteContactNumber+'</div><div> Awarding Body: '+this.AwardingBody+ ' - Cards Requested: '+this.CardsIncluded+ '</div><div>'+courses.toString().replaceAll(",","")+'</div></div><div class="sdNotes"><h2>Latest Note</h2><div>'+noteArr.toString().replaceAll(",","")+'</div></div><div class="taskButtons"><div><button type="button" name="button" class="btn btn-success spTaskButton"> Edit Course</button></div><div><button type="button" name="button" class="btn btn-info spTaskButton"> Add Note</button></div></div></div>')

            }
          }
        })
      }
    })
}).done(function(){
  hideUpdate(selected)
})
}


$(document).on("click","#toBeCancelled", function(){
  if ($(this).prop("checked")) {
    $(this).val(true)
    console.log($(this).closest(".cancelItems").children());
    $(this).closest(".cancelItems").children(".cancelReason").slideDown()
  } else {
    $(this).val(false)
    $(this).closest(".cancelItems").children(".cancelReason").slideUp()
  };
})

$(document).on("change", ".cancellationReason", function(){
  if($(this).val() == "Other"){
    $(this).closest(".cancelItems").children(".cancelOtherReason").slideDown()
  } else {
    $(this).closest(".cancelItems").children(".cancelOtherReason").slideUp()
  }
})

$(document).on("change",".cancelRateSelect", function(){
  let rate = $(this).closest(".cancelItems").find(".cancelDayRate")
  switch ($(this).val()) {
    case "100%": $(rate).val($(rate).attr("data-originalrate"))

      break;
      case "50%":
      let off50 = Number($(rate).attr("data-originalrate")) * 0.5
                  $(rate).val(off50)
        break;
        case "No":$(rate).val(0)

          break;
        default: $(rate).val($(rate).attr("data-originalrate"))
  }
})

$(document).on("click", ".cancelCancellation", function(){
  $(".cancelOptions").slideUp(400)
  $(".cancelTasks").slideUp(400)
  let cancelItem = this
  hideUpdate(this)
  setTimeout(function(){
    $(".cancelOptions").remove()
    $(".cancelTasks").remove()
  },500)
})

$(document).on("click", ".confirmCancellation", function(){
  let item = this
  let selectedId = $(this).closest(".diaryItems").attr("data-headerid")
  $(this).closest(".diaryItems").find(".cancelItems").each(function(){
    let toBeCanx = $(this).find("#toBeCancelled").val()
    let specificId = $(this).find(".courseRow").attr("data-objid")
    let reason = ""
    let originalRate = $(this).find(".cancelDayRate").attr("data-originalRate")
    let newRate = $(this).find(".cancelDayRate").val()
    if($(this).find(".cancelReason").find(".cancellationReason").val() === "Other"){
      reason = $(this).find(".cancelOtherReason").val()
    } else {
      reason = $(this).find(".cancelReason").find(".cancellationReason").val()
    }
    let user = $(".currentUser").attr("data-currentuser")
    console.log(toBeCanx);
    if(toBeCanx == "true"){
      $.post("/newNote",

        {
          postReqCurrent: selectedId,
          postReqNote: "Original Rate: £" + originalRate + " New Rate: £"+ newRate + "\nReason for Cancellation: " + reason,
          postReqUser: user,
          postReqSeverity: "Important",
          postReqTimeStamp: new Date($.now()).toLocaleDateString("en-GB")
        },
        function(data, status) {
          console.log(status);
        });
        $.post("/courseCancel",{
          selectedId: selectedId,
          bookingId: specificId,
          user: user,
          newRate: newRate
        }).done(function(){
          $(".diaryBody").find("[data-objid='"+specificId+"']").addClass("Cancelled")
          $(".cancelOptions").slideUp(300)
          $(".cancelTasks").slideUp(300)
          $(".diaryBody").find("[data-objid='"+specificId+"']").find(".spTaskButton").parent().remove()
          $(".diaryBody").find("[data-objid='"+specificId+"']").find(".sdNotes").children("div").remove()
          $(".diaryBody").find("[data-objid='"+specificId+"']").find(".sdNotes").append("<h2>Latest Note</h2>")
          let noteArr = ""
          $.get("/articles", function(data){
            $.each(data, function(){
              if(this._id == selectedId){
                let notes = this.Notes
                let createdBy = $(notes).last()[0].CreatedBy
                let createdAt = $(notes).last()[0].CreatedAt
                let note = $(notes).last()[0].Note
                let severity = $(notes).last()[0].Severity
                if(severity == "Important"){
                  noteArr = '<li class="note">'+note+'<i class="fas fa-exclamation importantNote"></i></li> </div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
                } else {
                  noteArr = '<li class="note">'+note+'</li></div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
                }
              }
            })
          })

          $(".diaryBody").find("[data-objid='"+specificId+"']").find(".sdNotes").append(noteArr)
          setTimeout(function(){
            $(".cancelOptions").remove()
            $(".cancelTasks").remove()
          },400)
hideUpdate(item)

        })

    }
  })
})


$(document).on("click", ".cancelNewNote", function(){
  $(this).closest(".newNote").slideUp(400)
  $(this).closest(".diaryItems").find(".taskButtons").slideDown()
  setTimeout(function(){
    $(this).closest(".newNote").remove()
  },500)
})

$(document).on("click", ".submiteNewNote", function(){
  let audience = ""
  if($(this).closest(".diaryItems").find(".audienceSelect").val() == "Everyone"){
    audience = "Standard"
  } else {
    audience = "Important"
  }
  let specificId = $(this).closest(".diaryItems").attr("data-objid")
  let note = $(this).closest(".diaryItems").find(".newNoteHere").val()
  let selectedId = $(this).closest(".diaryItems").attr("data-headerid")
  $.post("/newNote",

    {
      postReqCurrent: $(this).closest(".diaryItems").attr("data-headerid"),
      postReqNote: note,
      postReqUser: $(".currentUser").attr("data-currentuser"),
      postReqSeverity: audience,
      postReqTimeStamp: new Date($.now()).toLocaleDateString("en-GB")
    },
    function(data, status) {
      console.log(status);
    }).done(function(){
      $(".diaryBody").find("[data-objid='"+specificId+"']").find(".sdNotes").children().remove()
      $(".diaryBody").find("[data-objid='"+specificId+"']").find(".sdNotes").append("<h2>Latest Note</h2>")
      let noteArr = ""
      $.get("/articles", function(data){
        $.each(data, function(){
          if(this._id == selectedId){
            let notes = this.Notes
            let createdBy = $(notes).last()[0].CreatedBy
            let createdAt = $(notes).last()[0].CreatedAt
            let note = $(notes).last()[0].Note
            let severity = $(notes).last()[0].Severity
            if(severity == "Important"){
              noteArr = '<li class="note">'+note+'<i class="fas fa-exclamation importantNote"></i></li> </div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
            } else {
              noteArr = '<li class="note">'+note+'</li></div><div class="notesList"><li class="createdByNotes">'+createdBy+ ' @ '+createdAt+'</li>'
            }
          }
        })
      })

      $(".diaryBody").find("[data-objid='"+specificId+"']").find(".sdNotes").append(noteArr)
    })
    $(this).closest(".overallNote").slideUp(400)
    $(this).closest(".diaryItems").find(".taskButtons").slideDown()
    let item = this
    setTimeout(function(){
      $(item).closest(".newNote").remove()
    },500)
})


$(document).on("change", ".bookingTypeSelect", function(){
  if($(this).val() == "Training"){
    $(".proceedBooking").slideDown()
    $(".holOrAppoint").slideUp()
  } else {
    $(".proceedBooking").slideUp()
    $(".holOrAppoint").slideDown()
  }
})

$(document).on("click", ".submitHolOrApp", function(){
  let endDateCalc = new Date($(".holappEnd").val()).getTime()
  let startDateCalc = new Date($(".holappStart").val()).getTime()
  let calcTotal1 = endDateCalc - startDateCalc
  let calcTotal2 = calcTotal1 / (1000 * 3600 * 24) + 1;
  const getRanHex = size => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
  }
  let trainer = $("#holOrAppointTrainer").val()
  let start = $(".holappStart").val()
  let end = $(".holappEnd").val()
  let status = $(".bookingTypeSelect").val()
  let array = [{
    _id: getRanHex(24),
    Trainer: trainer,
    Start: start,
    End: end,
    el: start.replaceAll("-0","").replaceAll("-",""),
    TrainerStage:[{
      Stage: "New"
    }],
    TotalDays:calcTotal2
  }]
  let details = [{
    CreatedBy: $(".currentUser").attr("data-currentuser"),
    CreatedAt: new Date().toLocaleDateString("EN-GB"),
    Note: $(".details").val(),
    Severity: "Standard"
  }]
  let item = this
  $.post("/AppointmentHoliday",{
    Trainer: trainer,
    Start: start,
    End: end,
    Details: details,
    Status: status,
    Array: array
  }).done(function(){
    $(item).closest(".newBooking").append('<div class="bookingUpdatedNotification hidden"><i class="fa-regular fa-circle-check"></i></div>')
    $(item).closest(".newBooking").children(".bookingUpdatedNotification").fadeIn(300).delay(1000).fadeOut(300)
    setTimeout(function(){
      $(item).closest(".slideBody").animate({'top': '120%'}, 400)
      miscbookingRefresh(item)
    },400)
    })
  })



function miscbookingRefresh(selected){
  $(".bookingTypeSelect").prop('selectedIndex',0)
  $(".holOrAppoint").find('select').prop('selectedIndex',0)
  $(".holOrAppoint").find('textarea').val('')
  $(".holOrAppoint").find('input').val('')
  let item = selected
  setTimeout(function(){
    $(item).closest(".slideBody").hide(0)
    $(".holOrAppoint").slideUp()
  },1300)
}


$(document).on("click", ".showBookingForm", function(){
$.ajaxSetup({ cache: false });
  let vortexRef = ""
  $.get("/articles", function(data) {
    var itemCount = 0

    $.each(data, function(i) {

      if (data[i].VortexRef.startsWith("VB")) {
        itemCount++
      }
    })
    let location = Number(itemCount)
    let nextRef = Number(location) + 1
    vortexRef = "VB-" + (nextRef + '').padStart(4, "0")
  }).done(function(){
    $("#title").val(vortexRef)
  })
  $(".preCheck").slideUp()
  $(".newBookingInner").slideDown()
})

$(document).on("click", ".nextStage", function(){
  switch (false) {
    case $(".formPartOne").hasClass("hidden"): $(".formPartOne").slideUp(400)
                                              setTimeout(function(){
                                                $(".formPartOne").addClass("hidden")
                                                $(".formPartTwo").slideDown(400).removeClass("hidden")
                                              },400)
                                              $(".stageTwo").children(".horizontalLine").addClass("activetimeLine")
                                              $(".stageTwo").children(".circle").addClass("activeCircle")
                                              $(".prevPart").removeClass("hidden")



      break;

      case $(".formPartTwo").hasClass("hidden"):
      $(".formPartTwo").slideUp(400)
                                                setTimeout(function(){
                                                  $(".formPartTwo").addClass("hidden")
                                                  $(".formPartThree").slideDown(400).removeClass("hidden")
                                                },400)
                                                $(".stageThree").children(".horizontalLine").addClass("activetimeLine")
                                                $(".stageThree").children(".circle").addClass("activeCircle")
                                                $("#status").show()
                                                $(this).hide()
                                                $(".finalStage").show()
        break;
    default:

  }
})


$(document).on("click", ".prevStage", function(){
  switch (false) {
    case $(".formPartTwo").hasClass("hidden"): $(".formPartTwo").slideUp(400)
                                              setTimeout(function(){
                                                $(".formPartTwo").addClass("hidden")
                                                $(".formPartOne").slideDown(400).removeClass("hidden")
                                              },400)
                                              $(".stageTwo").children(".horizontalLine").removeClass("activetimeLine")
                                              $(".stageTwo").children(".circle").removeClass("activeCircle")
                                              $(".prevPart").addClass("hidden")



      break;

      case $(".formPartThree").hasClass("hidden"):
      $(".formPartThree").slideUp(400)
                                                setTimeout(function(){
                                                  $(".formPartThree").addClass("hidden")
                                                  $(".formPartTwo").slideDown(400).removeClass("hidden")
                                                },400)
                                                $(".stageThree").children(".horizontalLine").removeClass("activetimeLine")
                                                $(".stageThree").children(".circle").removeClass("activeCircle")
                                                $("#status").hide()
                                                $(".finalStage").hide()
                                                $(".nextStage").show()
        break;
    default:

  }
})

$(document).on("click", ".finalStage", function(){
  if($("#status").val() == "Select Status"){
    $("#status").css({'box-shadow': '0px 0px 7px 3px #C20808'})
  } else {
                                                $(".formPartThree").slideUp(400)
                                              setTimeout(function(){
                                                $(".formPartThree").addClass("hidden")
                                                $(".formPartFour").slideDown(400).removeClass("hidden")
                                              },400)
                                              $(".stageFour").children(".horizontalLine").addClass("activetimeLine")
                                              $(".stageFour").children(".circle").addClass("activeCircle")
                                              $(".stageFour").children(".circle").children("i").removeClass("hidden")
                                              newFormSubmission()
  }
})



$(document).on("click", ".registerOpen", function(){

  $(".registerSlide").show(10)
  $(".registerSlide").animate({'top': '30%'}, 400)
  let item = this
  if($(item).closest(".slideBody").hasClass("todayJob")){
    $(".registerSlide").attr("data-headerid",$(item).closest(".todayCourse").attr("data-headerid"))
    $(".registerSlide").attr("data-objid",$(item).closest(".todayCourse").attr("data-objid"))
    delegateList($(item).closest(".todayCourse").attr("data-headerid"))
  } else {
    $(".registerSlide").attr("data-headerid",$(item).closest(".openCourse").attr("data-headerid"))
    $(".registerSlide").attr("data-objid",$(item).closest(".openCourse").attr("data-objid"))
    delegateList($(item).closest(".openCourse").attr("data-headerid"))
  }
})

$(document).on("click", ".newDel", function(){
  $(".delUploadSlide").show(10)
  $(".delUploadSlide").animate({'top': '30%'}, 400)
})


$(document).on("click",".imageUploadDel", function(){
  $("#photoUpload").val('').click()
})


$("#photoUpload").on("change", function(){

  let userImage = ""
  let newImage = this.files[0]
  userImage = URL.createObjectURL(newImage)
  $(".imageBox").remove()
  $(".imageSection").children().remove()
  $(".imageSection").append('<img src='+userImage+' alt="" class="delegatePhoto">')
  $(".formSection").css("border-right", "solid")
  $(".formSection").css("border-right-width", "2px")
  if(this.files.length >= 1){
    $(".photoWarning").remove()
    $(".newDelSubmit").removeClass("disabled")
  } else {
    $(".addImage").after('<p class="photoWarning"> **Please select or take a photo of yourself</p>')
    $(".newDelSubmit").addClass("disabled")
  }
})

$(document).on("click", ".newDelSubmit", function(){
  let item = this
  if($(this).hasClass("disabled")){
    alert("Please add a photo")
  } else {
    $.ajaxSetup({
      async: false
    });
    event.preventDefault();
    $(".newDelSubmit").before('<div class="delUploadStatus"><img src="/Images/Spinner-1s-200px.gif" alt="">Uploading..Please do not navigate away from page<div>')
    let vortexRef = ""
    $.get("/articles", function(data){
      $.each(data, function(){
        let iD = this._id
        if(iD == $(".registerSlide").attr("data-headerid")){
          vortexRef = this.VortexRef
        }
      })
    })
    let randomDigit = Math.floor(Math.random() * 10) + 1
    let firstName = $("#firstName").val()
    let surName = $("#surName").val()
    let userId = firstName.charAt(0).toUpperCase() + surName.charAt(0).toUpperCase() + randomDigit + vortexRef.replaceAll("-0","")
   var data = new FormData($('#delegateRegister')[0]);
   data.append('userId',userId )
   data.append('selectedId', $(".registerSlide").attr("data-headerid"))
   data.append('specificId',$(".registerSlide").attr("data-objid"))
   data.append('firstName', $('#firstName').val())
  data.append('surName', $('#surName').val())
  data.append('company', $('#company').val())
  data.append('dateOfBirth', $('#dob').val())
  data.append('emailAddress', $('#email').val())
  data.append('mobileNumber', $('#contactNumber').val())
  data.append('idCheck', $('#idCheck').val())
  data.append('lastDig', $('#lastDig').val())


     $.ajax({
                url:'/registerSubmission',
                type: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                data: data,
                error: function(){
                    alert('Error: Document could not be uploaded, please try again');
                },
                complete: function(data) {
                  setTimeout(function(){
                    $(".delUploadStatus").remove()
                      $(".newDelSubmit").before('<div class="delUploadStatus"><i class="fa-solid fa-check"></i> Complete..Redirecting..<div>')
                      delegateList($(".registerSlide").attr("data-headerid"))
                      openJob()
                      todayJob()
                      $(item).closest(".slideBody").animate({'top': '120%'}, 400)
                  },600)
                  }
})
}
})

function delegateAdded(){
  setTimeout(function(){
    $(".imageSection").children().remove()
    $(".delUploadStatus").remove()
    $(".delUploadSlide").animate({'top': '120%'}, 400)
    $(".delUploadSlide").hide(0)
    $(".delUploadNew").find("input").each(function(){
          $(this).val('')
      })
        $(".delegateType").prop('selectedIndex',0)
},2000)
}

function delegateList(selectedId){
  $(".candidates").remove()
  let selected = selectedId

  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == selected){
        $.each(this.Bookings, function(){
          if(this._id == $(".registerSlide").attr('data-objid')){
            $.each(this.Delegates, function(){
              let footerRow = ""
              let checkBox = ""
              let results = ""
              let courses = []
              if(this.SignIn.length > 0){
                results = '<div><button type="button" name="button" class="delResults"> Results </button></div>'
                if(this.SignIn[this.SignIn.length -1].Date == new Date().toLocaleDateString("en-gb")){
                  checkBox = '<input class="form-check-input trainerRegCheck" type="checkbox" value="false" id="defaultCheck1" checked disabled>'
                }
              } else {
                checkBox ='<input class="form-check-input trainerRegCheck" type="checkbox" value="false" id="defaultCheck1">'

                results = '<div><button type="button" name="button" class="delResults disabled" disabled> Results </button></div>'
              }
              if(this.Course != undefined){
                if(this.Course.length > 0){
                  $.each(this.Course[0], function(){
                    courses.push('<li>'+this.Course+' - ' +this.PassFail+'</li>')
                  })
                }
              }

              if(this.IdCheckType == "" || this.IdCheckType == null){
                footerRow = '<div><div class="input-group"><div class="input-group-prepend"> <span class="input-group-text" id="basic-addon1">ID Type</span><select class="form-select mobileInput" name="" id="idCheck"> <option value="">Select One</option> <option value="Passport">Passport</option> <option value="Driving License">Driving License</option> <option value="CSCS">CSCS</option> <option value="Other">Other</option> </select><div class="input-group-prepend"> <span class="input-group-text" id="basic-addon1">Last 4 Digits</span> </div> <input type="number" name="" value="" placeholder="Last 4 Digits" class="form-control mobileInput" pattern="[0-9]*" id="lastDig"> </div></div></div>'
              }

              $(".registerScroll").prepend('<div class="candidates" data-userid="'+this.UserId+'"><div class="candidatesInner"><img src="'+this.ImageLocation+'" alt=""><div class="candidatesDetails"><li>'+this.FirstName+ ' ' +this. Surname+'</li><li>'+new Date(this.DateOfBirth).toLocaleDateString("en-gb")+'</li><li>'+this.MobileNumber+'</li><li>'+this.EmailAddress+'</li><li>'+this.Company+'</li><li>'+this.IdCheckType+' - '+this.idCheckDigits+'</li>'+courses.toString().replaceAll(",","")+footerRow+'</div><div class="trainerCheckIn"><div class="input-group-prepend"> <span class="input-group-text" id="basic-addon1">Trainer Check In</span> </div>'+checkBox+results+'</div></div>')
          })
        }
        })
      }
    })
  }).done(function(){
    delegateInterval("start")
  })
}

var delInt;

function delegateInterval(stopstart){
  switch (stopstart) {
    case "start":   delInt = setInterval(function(){
            let length = $(".registerScroll").children(".candidates").length
            $.get("/articles", function(data){
              $.each(data, function(){
                if(this._id == $('.registerSlide').attr('data-headerid')){
                  $.each(this.Bookings, function(){
                    if(this._id == $('.registerSlide').attr('data-objid')){
                      if(this.Delegates.length > length){
                        delegateList($('.registerSlide').attr('data-headerid'))
                      }
                    }
                  })

                }
              })
            })
          },5000)

      break;
    case "stop": clearInterval(delInt)

      break;

  }
}

$(document).on("click", ".trainerRegCheck", function(){
console.log($(this).closest(".candidates").find("#idCheck").val())
  if($(this).closest(".candidates").find("#idCheck").length > 0){
    if($(this).closest(".candidates").find("#idCheck").val() != ""){
      $.post("/trainerCheckIn", {
        selectedId: $(".registerSlide").attr("data-headerid"),
        specificId: $(".registerSlide").attr("data-objid"),
        userId:  $(this).closest(".candidates").attr("data-userid"),
        idCheck: $(this).closest(".candidates").find("#idCheck").val(),
        lastDig: $(this).closest(".candidates").find("#lastDig").val(),
        trainer: $(".currentUser").attr("data-currentuser")
      }).done(function(){
        delegateList($(".regiterSlide").attr("data-headerid"))
      })
    }
  } else {
    $.post("/trainerCheckIn", {
      selectedId: $(".registerSlide").attr("data-headerid"),
      specificId: $(".registerSlide").attr("data-objid"),
      userId:  $(this).closest(".candidates").attr("data-userid"),
      idCheck: $(this).closest(".candidates").find("#idCheck").val(),
      lastDig: $(this).closest(".candidates").find("#lastDig").val(),
      trainer: $(".currentUser").attr("data-currentuser")
    }).done(function(){
      delegateList($(".regiterSlide").attr("data-headerid"))
    })
  }
})


$(document).on("click", ".delResults", function(){
  let item = this
  $(this).slideUp()
  $.get("/articles", function(data){
    $.each(data, function(){
      if(this._id == $(".registerSlide").attr("data-headerid")){
        $.each(this.Bookings, function(){
          if(this._id == $(".registerSlide").attr("data-objid")){
            $.each(this.CourseInfo, function(){
                $(item).closest(".candidates").append('<div class="delCourseDetails"><div><input class="form-check-input courseCheck" type="checkbox" value="false" id="defaultCheck1"></div><div class="course">'+this.Course+'</div><div><select class="form-control mobileInput passFailSelect"><option value="">Select Pass/Fail</option><option value="Pass">Pass</option><option value="Fail">Fail</option></select></div></div>')
            })
          }
        })
      }
    })
  }).done(function(){
    $(item).closest(".candidates").append('<div class="courseButtons"><button type="button" name="button" class="delCourseSubmit">Submit</button><button type="button" name="button" class="delCourseCancel">Cancel</button></div>')})
  $(this).closest(".candidates").next(".divResultSelect").slideDown()
})

$(document).on("change",".passFailSelect", function(){
  console.log($(this).val());
  if($(this).val() == "Fail"){
    $(this).parent().after('<div class="failReasonDiv"><select class="form-control mobileInput failReason"><option value="">Reason for Failure</option><option value="Failed Practical">Failed Practical</option><option value="Failed Theory">Failed Theory</option><option value="Did not complete">Did not complete</option><option value="Other">Other</option></select></div>')
  } else {
    $(this).closest('.delCourseDetails').find('.failReasonDiv').remove()
  }
})

$(document).on("change",".failReason", function(){
  if($(this).val() == "Other"){
    $(this).after('<input type="text" name="" value="" class="form-control mobileInput otherReason" placeholder="Type Here">')
  } else {
    $(this).parent().find(".otherReason").remove()
  }
})


$(document).on("click", ".delCourseSubmit", function(){
  $.ajaxSetup({
    async: false
  });
  let candidate = $(this).closest(".candidates")
  let delCourseArr = []
  $(this).closest(".candidates").find('.delCourseDetails').each(function(){
    if($(this).find('.courseCheck').val() == "true"){
      let reasonForFailure = ""
      if($(this).find(".failReason").val()=="Other"){
        reasonForFailure = $(this).find(".otherReason").val()
      } else {
        reasonForFailure = $(this).find(".failReason").val()
      }
      delCourseArr.push({Course: $(this).find(".course").text(), Trainer: $('.currentUser').attr('data-currentuser'), PassFail:$(this).find('.passFailSelect').val(),FailReason:reasonForFailure,'Date': new Date().toISOString().slice(0, 10) })
    }
  })
  $.post("/delCourseResults",{
    userId: $(candidate).attr('data-userId'),
    selectedId: $(".registerSlide").attr('data-headerid'),
    specificId: $(".registerSlide").attr('data-objid'),
    courses: delCourseArr,
    trainer: $(".currentUser").attr("data-currentUser")
  }).done(function(){
    delegateList($(".registerSlide").attr("data-headerid"))
    openJob()
    todayJob()
  })
})


function hideDelCourse(item){
    let courses = $(item).closest(".candidates").find(".delCourseDetails");
  $(item).closest(".candidates").find(".courseButtons").slideUp(300)
  $(item).closest(".candidates").find(".delCourseDetails").slideUp(300)
  $(item).closest(".candidates").find(".delResults").slideDown(300)
  setTimeout(function(){
    $(courses).remove()
    $(item).closest(".candidates").find(".courseButtons").remove()
    $(item).closest(".candidates").find(".delCourseDetails").remove()
  },350)
}

$(document).on("click", ".delCourseCancel", function(){
hideDelCourse($(this))
})

$(document).on("click", ".courseCheck", function(){
  if($(this).prop('checked') == true){
    $(this).val('true')
  } else {
    $(this).val('false')
  }
})
