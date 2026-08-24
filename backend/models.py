from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# 1. جدول القارات
class Continent(Base):
    __tablename__ = "continents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False) # مثل: آسيا، أوروبا، أفريقيا
    code = Column(String(50), nullable=True) # مثل: asia, europe, africa

    # العلاقات
    countries = relationship("Country", back_populates="continent", cascade="all, delete-orphan")


# 2. جدول الدول
class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False) # مثل: السعودية، اليابان
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    slug = Column(String(100), nullable=True) # مثل: saudi, japan

    # المفتاح الأجنبي لربط الدولة بالقارة
    continent_id = Column(Integer, ForeignKey("continents.id"), nullable=True)

    # العلاقات
    continent = relationship("Continent", back_populates="countries")
    cities = relationship("City", back_populates="country", cascade="all, delete-orphan")
    recipes = relationship("Recipe", back_populates="country", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="country", cascade="all, delete-orphan")


# 3. جدول المدن والمناطق
class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False) # مثل: الرياض، طوكيو، مراكش

    # المفتاح الأجنبي لربط المدينة بالدولة
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False)

    # العلاقات
    country = relationship("Country", back_populates="cities")
    events = relationship("Event", back_populates="city")


# 4. جدول الوصفات والأكلات
class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False) # مثل: السليق، الكبسة
    category = Column(String(100), nullable=True) # رئيسية، حلويات، سناكات
    ingredients = Column(Text, nullable=True) # المكونات والكميات
    spices = Column(Text, nullable=True) # البهارات
    sauces = Column(Text, nullable=True) # الصوصات المرافقة
    steps = Column(Text, nullable=True) # خطوات التحضير
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # المفتاح الأجنبي لربط الوصفة بالدولة
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=True)

    # العلاقات
    country = relationship("Country", back_populates="recipes")


# 5. جدول الفعاليات والتجارب
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False) # مثل: موسم السودة
    category = Column(String(150), nullable=True) # شواطئ وبحار، سفاري وجبال، متاحف ومعالم...
    description = Column(Text, nullable=True)
    date_info = Column(String(150), nullable=True) # مثل: يونيو – سبتمبر
    duration = Column(String(100), nullable=True) # مدة الزيارة
    weather = Column(String(100), nullable=True) # الطقس
    airport = Column(String(150), nullable=True) # أقرب مطار
    activities = Column(Text, nullable=True) # الأنشطة والأسعار
    hotel_price = Column(String(100), nullable=True) # تكلفة الفنادق
    total_cost = Column(String(100), nullable=True) # التكلفة الإجمالية التقديرية
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # المفاتيح الأجنبية لربط الفعالية بالدولة والمدينة
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)

    # العلاقات
    country = relationship("Country", back_populates="events")
    city = relationship("City", back_populates="events")