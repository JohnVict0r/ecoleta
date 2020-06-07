import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import Header from '../../components/Header';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';

import api from '../../services/api';
import ibgeApi from '../../services/ibgeApi';
import * as yup from 'yup';

import FieldSet from '../../components/FieldSet';
import FieldGroup from '../../components/FieldGroup';
import FieldInput from '../../components/FieldInput';
import FieldSelect from '../../components/FieldSelect';
import ItemsGrid from '../../components/ItemsGrid';

import * as Types from '../../interfaces';

const scheme = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  whatsapp: yup.string().required(),
  uf: yup.string().required(),
  city: yup.string().required(),
  latitude: yup
    .number()
    .test({
      test: (value) => {
        return value !== 0;
      },
    })
    .required(),
  longitude: yup
    .number()
    .test({
      test: (value) => {
        return value !== 0;
      },
    })
    .required(),
});

const CreatePoint = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [items, setItems] = useState<Types.Item[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('/items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    ibgeApi.indexUF((response) => {
      const ufInitials = response.data.map((uf) => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    ibgeApi.indexUFCities(selectedUf, (response) => {
      const citiesList = response.data.map((city) => city.nome);
      setCities(citiesList);
    });
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    if (selectedItems.includes(id)) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };

    // TODO show errors of validate
    scheme
      .isValid(data)
      .then(async (valid) => {
        if (valid) {
          await api.post('/points', data);
          history.push('/');
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <div id="page-create-point">
      <Header>
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </Header>

      <form onSubmit={handleSubmit} autoComplete="off">
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>

        <FieldSet title="Dados">
          <FieldInput
            name="name"
            type="text"
            label="Nome da entidade"
            handleInputChange={handleInputChange}
          />

          <FieldGroup>
            <FieldInput
              name="email"
              type="email"
              label="E-mail"
              handleInputChange={handleInputChange}
            />
            <FieldInput
              name="whatsapp"
              type="text"
              label="Whatsapp"
              handleInputChange={handleInputChange}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet title="Endereço" instructions="Selecione o endereço no mapa">
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <FieldGroup>
            <FieldSelect
              name="uf"
              label="Estado (UF)"
              instructions="Selecione uma UF"
              data={ufs}
              value={selectedUf}
              handleChange={handleSelectUf}
            />
            <FieldSelect
              name="city"
              label="Cidade"
              instructions="Selecione uma cidade"
              data={cities}
              value={selectedCity}
              handleChange={handleSelectCity}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet
          title="Itens de coleta"
          instructions="Selecione um ou mais itens abaixo"
        >
          <ItemsGrid
            data={items}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectItem}
          />
        </FieldSet>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
