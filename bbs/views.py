from django.shortcuts import render

from django.views import View

from django.http.response import JsonResponse
from django.template.loader import render_to_string
from django.db.models import Q


from .models import Topic
from .forms import TopicForm




class BbsView(View):

    def get(self, request, *args, **kwargs):

        topics  = Topic.objects.all()
        context = { "topics":topics }

        return render(request,"bbs/index.html",context)

    def post(self, request, *args, **kwargs):

        json    = { "error":True }
        form    = TopicForm(request.POST)

        if not form.is_valid():
            print("Validation Error")
            return JsonResponse(json)

        form.save()
        json["error"]   = False

        topics          = Topic.objects.all()
        context         = { "topics":topics }
        content         = render_to_string("bbs/content.html",context,request)

        json["content"] = content

        return JsonResponse(json)

index   = BbsView.as_view()

class RefreshView(View):

    def get(self, request, *args, **kwargs):

        json    = { "error":True }

        #TODO:ここで検索処理を実行
        #TODO:もしここでAPIを使用して、リクエストを送信し、値を手に入れる場合、受け取ったJSONを辞書型に変換して正規表現などを使用して検索をする
        if "search" in request.GET:
            print(request.GET["search"])

            #(1)キーワードが空欄もしくはスペースのみの場合、ページにリダイレクト
            if request.GET["search"] == "" or request.GET["search"].isspace():
                topics  = Topic.objects.all()

            #(2)キーワードをリスト化させる(複数指定の場合に対応させるため)
            search      = request.GET["search"].replace("　"," ")
            search_list = search.split(" ")

            #(3)クエリを作る
            query       = Q()
            for word in search_list:

                #空欄の場合は次のループへ
                if word == "":
                    continue

                #TIPS:AND検索の場合は&を、OR検索の場合は|を使用する。
                query &= Q(comment__contains=word)

            #(4)作ったクエリを実行
            topics  = Topic.objects.filter(query)
        else:
            topics  = Topic.objects.all()

        context = { "topics":topics }
        content = render_to_string("bbs/content.html",context,request)

        json["error"]   = False
        json["content"] = content

        return JsonResponse(json)

refresh = RefreshView.as_view()

