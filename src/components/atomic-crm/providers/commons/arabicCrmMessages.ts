import type { CrmMessages } from "./englishCrmMessages";

// Pluralized strings carry the six Arabic plural forms polyglot expects for
// "ar": 0 |||| 1 |||| 2 |||| 3-10 |||| 11-99 |||| 100+.
// Resource `name` keys use the generic plural for form 2 because ra-core
// passes smart_count: 2 to mean "plural" for list titles and menus.
export const arabicCrmMessages = {
  resources: {
    companies: {
      name: "الشركات |||| شركة |||| الشركات |||| الشركات |||| الشركات |||| الشركات",
      forcedCaseName: "شركة",
      fields: {
        name: "اسم الشركة",
        website: "الموقع الإلكتروني",
        linkedin_url: "رابط LinkedIn",
        phone_number: "رقم الهاتف",
        created_at: "تاريخ الإنشاء",
        nb_contacts: "عدد جهات الاتصال",
        revenue: "الإيرادات",
        sector: "القطاع",
        size: "الحجم",
        tax_identifier: "الرقم الضريبي",
        address: "العنوان",
        city: "المدينة",
        zipcode: "الرمز البريدي",
        state_abbr: "المحافظة",
        country: "الدولة",
        description: "الوصف",
        context_links: "روابط مرجعية",
        sales_id: "مسؤول الحساب",
      },
      empty: {
        description: "يبدو أن قائمة الشركات فارغة.",
        title: "لا توجد شركات",
      },
      import: {
        title: "استيراد الشركات",
      },
      field_categories: {
        contact: "التواصل",
        additional_info: "معلومات إضافية",
        address: "العنوان",
        context: "السياق",
      },
      action: {
        create: "إنشاء شركة",
        edit: "تعديل الشركة",
        new: "شركة جديدة",
        show: "عرض الشركة",
      },
      added_on: "أُضيفت في %{date}",
      followed_by: "يتابعها %{name}",
      followed_by_you: "أنت تتابعها",
      no_contacts: "لا توجد جهات اتصال",
      nb_contacts:
        "لا توجد جهات اتصال |||| جهة اتصال واحدة |||| جهتا اتصال |||| %{smart_count} جهات اتصال |||| %{smart_count} جهة اتصال |||| %{smart_count} جهة اتصال",
      nb_deals:
        "لا توجد صفقات |||| صفقة واحدة |||| صفقتان |||| %{smart_count} صفقات |||| %{smart_count} صفقة |||| %{smart_count} صفقة",
      sizes: {
        one_employee: "موظف واحد",
        two_to_nine_employees: "2-9 موظفين",
        ten_to_forty_nine_employees: "10-49 موظفًا",
        fifty_to_two_hundred_forty_nine_employees: "50-249 موظفًا",
        two_hundred_fifty_or_more_employees: "250 موظفًا أو أكثر",
      },
      autocomplete: {
        create_error: "حدث خطأ أثناء إنشاء الشركة",
        create_item: "إنشاء %{item}",
        create_label: "ابدأ الكتابة لإنشاء شركة جديدة",
      },
    },
    contacts: {
      name: "جهات الاتصال |||| جهة اتصال |||| جهات الاتصال |||| جهات الاتصال |||| جهات الاتصال |||| جهات الاتصال",
      forcedCaseName: "جهة اتصال",
      field_categories: {
        background_info: "معلومات خلفية",
        identity: "الهوية",
        misc: "متفرقات",
        personal_info: "معلومات شخصية",
        position: "المنصب",
      },
      fields: {
        first_name: "الاسم الأول",
        last_name: "اسم العائلة",
        last_seen: "آخر نشاط",
        title: "المسمى الوظيفي",
        company_id: "الشركة",
        email_jsonb: "عناوين البريد الإلكتروني",
        email: "البريد الإلكتروني",
        phone_jsonb: "أرقام الهاتف",
        phone_number: "رقم الهاتف",
        linkedin_url: "رابط LinkedIn",
        background: "معلومات خلفية (نبذة، كيف تعرفتم، إلخ)",
        has_newsletter: "مشترك في النشرة",
        sales_id: "مسؤول الحساب",
      },
      action: {
        add: "إضافة جهة اتصال",
        add_first: "أضف أول جهة اتصال",
        create: "إنشاء جهة اتصال",
        edit: "تعديل جهة الاتصال",
        export_vcard: "تصدير بصيغة vCard",
        new: "جهة اتصال جديدة",
        show: "عرض جهة الاتصال",
      },
      background: {
        last_activity_on: "آخر نشاط في %{date}",
        added_on: "أُضيفت في %{date}",
        followed_by: "يتابعها %{name}",
        followed_by_you: "أنت تتابعها",
        status_none: "لا شيء",
      },
      position_at: "%{title} في",
      position_at_company: "%{title} في %{company}",
      empty: {
        description: "يبدو أن قائمة جهات الاتصال فارغة.",
        title: "لا توجد جهات اتصال",
      },
      import: {
        title: "استيراد جهات الاتصال",
      },
      inputs: {
        genders: {
          male: "ذكر",
          female: "أنثى",
          nonbinary: "غير محدد",
        },
        personal_info_types: {
          work: "العمل",
          home: "المنزل",
          other: "أخرى",
        },
      },
      list: {
        error_loading: "خطأ في تحميل جهات الاتصال",
      },
      bulk_tag: {
        action: "وسم",
        back: "العودة إلى الوسوم",
        create_description:
          "أنشئ وسمًا جديدًا وطبّقه على جهات الاتصال المحددة.",
        description:
          "اختر وسمًا موجودًا أو أنشئ وسمًا جديدًا لجهات الاتصال المحددة.",
        empty: "لا توجد وسوم بعد. أنشئ وسمًا لتطبيقه على جهات الاتصال المحددة.",
        error: "فشل إضافة الوسم إلى جهات الاتصال",
        noop: "جهات الاتصال المحددة لديها هذا الوسم بالفعل",
        success:
          "لم تتم إضافة الوسم |||| تمت إضافة الوسم إلى جهة اتصال واحدة |||| تمت إضافة الوسم إلى جهتي اتصال |||| تمت إضافة الوسم إلى %{smart_count} جهات اتصال |||| تمت إضافة الوسم إلى %{smart_count} جهة اتصال |||| تمت إضافة الوسم إلى %{smart_count} جهة اتصال",
        title: "إضافة وسم إلى جهات الاتصال",
      },
      merge: {
        action: "دمج مع جهة اتصال أخرى",
        confirm: "دمج جهات الاتصال",
        current_contact: "جهة الاتصال الحالية (سيتم حذفها)",
        description: "دمج جهة الاتصال هذه مع جهة أخرى.",
        error: "فشل دمج جهات الاتصال",
        merging: "جارٍ الدمج...",
        no_additional_data: "لا توجد بيانات إضافية للدمج",
        select_target: "يرجى اختيار جهة اتصال للدمج معها",
        success: "تم دمج جهات الاتصال بنجاح",
        target_contact: "جهة الاتصال الهدف (سيتم الاحتفاظ بها)",
        title: "دمج جهة اتصال",
        warning_description:
          "سيتم نقل كل البيانات إلى جهة الاتصال الثانية. لا يمكن التراجع عن هذا الإجراء.",
        warning_title: "تحذير: عملية لا يمكن التراجع عنها",
        what_will_be_merged: "ما سيتم دمجه:",
      },
      filters: {
        before_last_month: "قبل الشهر الماضي",
        before_this_month: "قبل هذا الشهر",
        before_this_week: "قبل هذا الأسبوع",
        managed_by_me: "التي أديرها",
        search: "ابحث بالاسم أو الشركة...",
        this_week: "هذا الأسبوع",
        today: "اليوم",
        tags: "الوسوم",
        tasks: "المهام",
      },
      hot: {
        empty_change_status:
          'غيّر حالة جهة الاتصال بإضافة ملاحظة لها ثم الضغط على "إظهار الخيارات".',
        empty_hint: 'جهات الاتصال ذات الحالة "ساخن" ستظهر هنا.',
        title: "جهات اتصال ساخنة",
      },
    },
    deals: {
      name: "الصفقات |||| صفقة |||| الصفقات |||| الصفقات |||| الصفقات |||| الصفقات",
      fields: {
        name: "الاسم",
        description: "الوصف",
        company_id: "الشركة",
        contact_ids: "جهات الاتصال",
        category: "الفئة",
        amount: "الميزانية",
        expected_closing_date: "تاريخ الإغلاق المتوقع",
        stage: "المرحلة",
      },
      action: {
        back_to_deal: "العودة إلى الصفقة",
        create: "إنشاء صفقة",
        new: "صفقة جديدة",
      },
      field_categories: {
        misc: "متفرقات",
      },
      filters: {
        only_mine: "الصفقات التي أديرها فقط",
      },
      archived: {
        action: "أرشفة",
        error: "خطأ: لم تتم أرشفة الصفقة",
        list_title: "الصفقات المؤرشفة",
        success: "تمت أرشفة الصفقة",
        title: "صفقة مؤرشفة",
        view: "عرض الصفقات المؤرشفة",
      },
      inputs: {
        linked_to: "مرتبطة بـ",
      },
      unarchived: {
        action: "إعادتها إلى اللوحة",
        error: "خطأ: لم يتم إلغاء أرشفة الصفقة",
        success: "تم إلغاء أرشفة الصفقة",
      },
      updated: "تم تحديث الصفقة",
      empty: {
        before_create: "قبل إنشاء صفقة.",
        description: "يبدو أن قائمة الصفقات فارغة.",
        title: "لا توجد صفقات",
      },
      import: {
        title: "استيراد الصفقات",
      },
      invalid_date: "تاريخ غير صالح",
    },
    notes: {
      name: "الملاحظات |||| ملاحظة |||| الملاحظات |||| الملاحظات |||| الملاحظات |||| الملاحظات",
      forcedCaseName: "ملاحظة",
      fields: {
        status: "الحالة",
        date: "التاريخ",
        attachments: "المرفقات",
        contact_id: "جهة الاتصال",
        deal_id: "الصفقة",
      },
      action: {
        add: "إضافة ملاحظة",
        add_first: "أضف أول ملاحظة",
        delete: "حذف الملاحظة",
        edit: "تعديل الملاحظة",
        update: "تحديث الملاحظة",
        add_this: "إضافة هذه الملاحظة",
      },
      sheet: {
        create: "إنشاء ملاحظة",
        create_for: "إنشاء ملاحظة لـ %{name}",
        edit: "تعديل الملاحظة",
        edit_for: "تعديل ملاحظة %{name}",
      },
      deleted: "تم حذف الملاحظة",
      empty: "لا توجد ملاحظات بعد",
      author_added: "أضاف %{name} ملاحظة",
      you_added: "أضفت ملاحظة",
      me: "أنا",
      list: {
        error_loading: "خطأ في تحميل الملاحظات",
      },
      note_for_contact: "ملاحظة لـ %{name}",
      stepper: {
        hint: "اذهب إلى صفحة جهة اتصال وأضف ملاحظة",
      },
      added: "تمت إضافة الملاحظة",
      inputs: {
        add_note: "أضف ملاحظة",
        options_hint: "(إرفاق ملفات أو تغيير التفاصيل)",
        show_options: "إظهار الخيارات",
      },
      actions: {
        attach_document: "إرفاق مستند",
      },
      validation: {
        note_or_attachment_required: "يجب إدخال ملاحظة أو مرفق",
      },
    },
    sales: {
      name: "المستخدمون |||| مستخدم |||| المستخدمون |||| المستخدمون |||| المستخدمون |||| المستخدمون",
      fields: {
        first_name: "الاسم الأول",
        last_name: "اسم العائلة",
        email: "البريد الإلكتروني",
        secondary_email: "بريد إلكتروني إضافي",
        secondary_emails: "عناوين بريد إضافية",
        administrator: "مسؤول",
        disabled: "معطّل",
      },
      create: {
        error: "حدث خطأ أثناء إنشاء المستخدم.",
        success:
          "تم إنشاء المستخدم. سيصله قريبًا بريد إلكتروني لتعيين كلمة المرور.",
        title: "إنشاء مستخدم جديد",
      },
      edit: {
        error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
        record_not_found: "السجل غير موجود",
        success: "تم تحديث المستخدم بنجاح",
        title: "تعديل %{name}",
      },
      action: {
        new: "مستخدم جديد",
      },
    },
    tasks: {
      name: "المهام |||| مهمة |||| المهام |||| المهام |||| المهام |||| المهام",
      forcedCaseName: "مهمة",
      fields: {
        text: "الوصف",
        due_date: "تاريخ الاستحقاق",
        type: "النوع",
        contact_id: "جهة الاتصال",
        due_short: "يستحق",
      },
      action: {
        add: "إضافة مهمة",
        create: "إنشاء مهمة",
        edit: "تعديل المهمة",
      },
      actions: {
        postpone_next_week: "تأجيل للأسبوع القادم",
        postpone_tomorrow: "تأجيل للغد",
        title: "إجراءات المهمة",
      },
      added: "تمت إضافة المهمة",
      deleted: "تم حذف المهمة بنجاح",
      dialog: {
        create: "إنشاء مهمة",
        create_for: "إنشاء مهمة لـ %{name}",
      },
      sheet: {
        edit: "تعديل المهمة",
        edit_for: "تعديل مهمة %{name}",
      },
      empty: "لا توجد مهام بعد",
      empty_list_hint: "المهام المضافة إلى جهات الاتصال ستظهر هنا.",
      filters: {
        later: "لاحقًا",
        overdue: "متأخرة",
        this_week: "هذا الأسبوع",
        today: "اليوم",
        tomorrow: "غدًا",
        with_pending: "لديها مهام معلقة",
      },
      regarding_contact: "(بخصوص: %{name})",
      updated: "تم تحديث المهمة",
    },
    tags: {
      name: "الوسوم |||| وسم |||| الوسوم |||| الوسوم |||| الوسوم |||| الوسوم",
      action: {
        add: "إضافة وسم",
        create: "إنشاء وسم جديد",
      },
      dialog: {
        color: "اللون",
        create_title: "إنشاء وسم جديد",
        edit_title: "تعديل الوسم",
        name_label: "اسم الوسم",
        name_placeholder: "أدخل اسم الوسم",
      },
      empty: "لا توجد وسوم بعد.",
    },
  },
  crm: {
    action: {
      reset_password: "إعادة تعيين كلمة المرور",
    },
    auth: {
      first_name: "الاسم الأول",
      last_name: "اسم العائلة",
      confirm_password: "تأكيد كلمة المرور",
      confirmation_required:
        "يرجى فتح الرابط الذي أرسلناه إلى بريدك الإلكتروني لتأكيد حسابك.",
      recovery_email_sent:
        "إذا كنت مستخدمًا مسجلًا، ستصلك رسالة استعادة كلمة المرور قريبًا.",
      sign_in_failed: "فشل تسجيل الدخول.",
      sign_in_google_workspace: "تسجيل الدخول باستخدام Google Workspace",
      signup: {
        create_account: "إنشاء حساب",
        create_first_user: "أنشئ أول حساب مستخدم لإكمال الإعداد.",
        creating: "جارٍ الإنشاء...",
        initial_user_created: "تم إنشاء المستخدم الأول بنجاح",
      },
      welcome_title: "مرحبًا بك في Atomic CRM",
    },
    common: {
      account_manager: "مسؤول الحساب",
      activity: "النشاط",
      added: "أضاف",
      details: "التفاصيل",
      last_activity_with_date: "آخر نشاط %{date}",
      load_more: "تحميل المزيد",
      misc: "متفرقات",
      past: "سابقة",
      read_more: "اقرأ المزيد",
      retry: "إعادة المحاولة",
      show_less: "عرض أقل",
      copied: "تم النسخ!",
      copy: "نسخ",
      loading: "جارٍ التحميل...",
      me: "أنا",
      task_count:
        "لا توجد مهام |||| مهمة واحدة |||| مهمتان |||| %{smart_count} مهام |||| %{smart_count} مهمة |||| %{smart_count} مهمة",
    },
    changelog: {
      title: "سجل التغييرات",
    },
    activity: {
      added_company: "أضاف %{name} الشركة",
      you_added_company: "أضفت الشركة",
      added_contact: "أضاف %{name}",
      you_added_contact: "أضفت",
      added_note: "أضاف %{name} ملاحظة عن",
      you_added_note: "أضفت ملاحظة عن",
      added_note_about_deal: "أضاف %{name} ملاحظة عن الصفقة",
      you_added_note_about_deal: "أضفت ملاحظة عن الصفقة",
      added_deal: "أضاف %{name} الصفقة",
      you_added_deal: "أضفت الصفقة",
      at_company: "في",
      to: "إلى",
      load_more: "تحميل المزيد من النشاط",
    },
    dashboard: {
      deals_chart: "إيرادات الصفقات القادمة",
      deals_pipeline: "مسار الصفقات",
      latest_activity: "آخر النشاطات",
      latest_activity_error: "خطأ في تحميل آخر النشاطات",
      latest_notes: "آخر ملاحظاتي",
      latest_notes_added_ago: "أُضيفت %{timeAgo}",
      stepper: {
        install: "تثبيت Atomic CRM",
        progress: "تم %{step}/3",
        whats_next: "ما التالي؟",
      },
      upcoming_tasks: "المهام القادمة",
    },
    data_import: {
      button: "استيراد CSV",
      complete:
        "اكتمل الاستيراد. تم استيراد %{importCount} سجل، مع %{errorCount} أخطاء",
      csv_file: "ملف CSV",
      error: "فشل استيراد هذا الملف، تأكد من أنه ملف CSV صالح.",
      in_progress: "جارٍ الاستيراد…",
      progress:
        "تم استيراد %{importCount} / %{rowCount} سجل، مع %{errorCount} أخطاء.",
      remaining_time: "الوقت المتبقي التقريبي:",
      resource: "المورد",
      sample_download: "تنزيل ملف CSV نموذجي",
      sample_hint: "هذا ملف CSV نموذجي يمكنك استخدامه كقالب",
      start: "بدء الاستيراد",
      stop: "إيقاف الاستيراد",
      stopped:
        "تم إيقاف الاستيراد. تم استيراد %{importCount} سجل، مع %{errorCount} أخطاء",
      title: "استيراد البيانات",
    },
    header: {
      import_data: "استيراد من JSON",
    },
    image_editor: {
      change: "تغيير",
      drop_hint: "اسحب ملفًا هنا للرفع، أو اضغط لاختياره.",
      editable_content: "محتوى قابل للتعديل",
      title: "رفع الصورة وتغيير حجمها",
      update_image: "تحديث الصورة",
    },
    import: {
      action: {
        download_error_report: "تنزيل تقرير الأخطاء",
        import: "استيراد",
        import_another: "استيراد ملف آخر",
      },
      error: {
        unable: "تعذر استيراد هذا الملف.",
      },
      idle: {
        description_1:
          "يمكنك استيراد المستخدمين والشركات وجهات الاتصال والملاحظات والمهام.",
        description_2: "يجب أن تكون البيانات في ملف JSON يطابق النموذج التالي:",
      },
      status: {
        all_success: "تم استيراد كل السجلات بنجاح.",
        complete: "اكتمل الاستيراد.",
        failed: "فشل",
        imported: "تم الاستيراد",
        in_progress: "جارٍ الاستيراد، يرجى عدم مغادرة هذه الصفحة.",
        some_failed: "لم يتم استيراد بعض السجلات.",
        table_caption: "حالة الاستيراد",
      },
      title: "استيراد من JSON",
    },
    settings: {
      about: "حول",
      companies: {
        sectors: "القطاعات",
      },
      dark_mode_logo: "شعار الوضع الداكن",
      deals: {
        categories: "الفئات",
        currency: "العملة",
        pipeline_help: "اختر مراحل الصفقات التي تُحتسب ضمن المسار.",
        pipeline_statuses: "حالات المسار",
        stages: "المراحل",
      },
      light_mode_logo: "شعار الوضع الفاتح",
      notes: {
        statuses: "الحالات",
      },
      reset_defaults: "استعادة الإعدادات الافتراضية",
      save_error: "فشل حفظ الإعدادات",
      saved: "تم حفظ الإعدادات بنجاح",
      saving: "جارٍ الحفظ...",
      tasks: {
        types: "الأنواع",
      },
      preferences: "التفضيلات",
      title: "الإعدادات",
      app_title: "عنوان التطبيق",
      sections: {
        branding: "الهوية البصرية",
      },
      validation: {
        duplicate: "%{display_name} مكررة: %{items}",
        in_use: "لا يمكن حذف %{display_name} المستخدمة في صفقات: %{items}",
        validating: "جارٍ التحقق…",
        entities: {
          categories: "الفئات",
          stages: "المراحل",
        },
      },
    },
    theme: {
      dark: "داكن",
      label: "المظهر",
      light: "فاتح",
      system: "النظام",
    },
    language: "اللغة",
    navigation: {
      label: "تنقل CRM",
    },
    profile: {
      add_secondary_email: "إضافة بريد إلكتروني",
      email_taken: "%{email} مستخدم بالفعل من مستخدم آخر",
      no_secondary_emails: "لا يوجد",
      secondary_email_invalid: "%{email} ليس بريدًا إلكترونيًا صالحًا",
      secondary_email_is_primary: "%{email} هو بريدك الأساسي بالفعل",
      secondary_email_taken: "%{email} مستخدم بالفعل من مستخدم آخر",
      too_many_secondary_emails: "لا يمكنك إضافة أكثر من 10 عناوين بريد إضافية",
      secondary_emails_help:
        "عناوين أخرى ترسل منها رسائلك. اترك الحقل فارغًا لحذفه.",
      inbound: {
        description:
          "يمكنك إرسال رسائل إلى عنوان البريد الوارد للخادم، مثلًا بإضافته إلى حقل %{field}. سيعالج Atomic CRM الرسائل ويضيف ملاحظات إلى جهات الاتصال المطابقة.",
        title: "البريد الوارد",
      },
      mcp: {
        title: "خادم MCP",
        description:
          "استخدم هذا الرابط لربط مساعد الذكاء الاصطناعي ببيانات CRM عبر بروتوكول MCP.",
      },
      password: {
        change: "تغيير كلمة المرور",
      },
      password_reset_sent:
        "تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
      record_not_found: "السجل غير موجود",
      title: "الملف الشخصي",
      updated: "تم تحديث ملفك الشخصي",
      update_error: "حدث خطأ. يرجى المحاولة مرة أخرى",
    },
    validation: {
      invalid_url: "يجب أن يكون رابطًا صالحًا",
      invalid_linkedin_url: "يجب أن يكون الرابط من linkedin.com",
    },
  },
} satisfies CrmMessages;
